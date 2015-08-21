(function() {
    angular
        .module('xApp', dependencies())
        .config(config);

    function dependencies() {
        return [
            'ngSanitize',
            'ngResource',
            'ngAnimate',
            'ngCookies',
            'ui.bootstrap',
            'ui.router',
            'ui.select',
            'angularMoment',
            'toaster',
            'angular-jwt',
            'cfp.hotkeys',
            'colorpicker.module'
        ];
    }

    function config($stateProvider, $urlRouterProvider, $httpProvider, uiSelectConfig, jwtInterceptorProvider) {
        uiSelectConfig.theme = 'bootstrap';

        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: ['anon']
                }
            })
            .state('anon.check', {
                url: '',
                controller: function($location, AuthFactory) {
                    if (AuthFactory.isLoggedIn()) {
                        $location.path('/recent');
                    } else {
                        $location.path('/login');
                    }
                }
            })
            .state('anon.login', {
                url: '/login',
                templateUrl: '/t/auth/login.html',
                controller: 'AuthController'
            });

        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: '/t/home/home.html',
                controller: function($scope, $rootScope, $location, $modal, projects, AuthFactory, Api, $filter, $state, hotkeys) {
                    $scope.projects = projects;

                    $scope.login = AuthFactory.getUser();

                    $scope.jump = jump;
                    $scope.isEntryActive = $state.is('user.project');

                    hotkeys.add({
                        combo: 'ctrl+p',
                        description: 'Show project jump window',
                        allowIn: ['input', 'select', 'textarea'],
                        callback: function(event, hotkey) {
                            event.preventDefault();
                            jump();
                        }
                    });

                    function jump() {
                        $scope.$broadcast('toggleJump');
                    }

                    $rootScope.$on('$stateChangeStart', function(event, toState) {
                        $scope.isEntryActive = toState.name == 'user.project' || toState.name == 'user.projects';
                    });

                    $scope.$on('project:update', function(event, project) {
                        $scope.projects[$scope.projects.map(function (i) {return i.id;}).indexOf(project.id)] = project;
                    });
                },
                resolve: {
                    projects: function(Api) {
                        return Api.project.query();
                    }
                }
            })
            .state('user.home', {
                url: '/recent',
                templateUrl: '/t/home/recentlyUsed.html',
                controller: 'HomeController',
                resolve: {
                    recent: function(RecentFactory) {
                        return RecentFactory.query();
                    }
                }
            })
            .state('user.project', {
                url: '/project/:projectId/:active?',
                templateUrl: '/t/entry/list.html',
                controller: 'EntryController',
                resolve: {
                    project: function ($stateParams, projects) {
                        return projects.$promise.then(function(projects) {
                            for (var i=0; i<projects.length; i++) {
                                if (projects[i].id == parseInt($stateParams.projectId)) {
                                    return projects[i];
                                }
                            }
                            throw "Project not found!";
                        });
                    },
                    entries: function($stateParams, Api) {
                        return Api.projectKeys.query({id: $stateParams.projectId});
                    },
                    active: function($stateParams, entries) {
                        if ($stateParams.active) {
                            return entries.$promise.then(function(entries) {
                                var key = _.find(
                                    entries,
                                    _.matchesProperty('id', parseInt($stateParams.active))
                                );

                                if (key == undefined) { // for some odd reason PHP 5.4 returns IDS as strings
                                    key = _.find(
                                        entries,
                                        _.matchesProperty('id', $stateParams.active)
                                    );
                                }
                                return key;
                            });
                        }
                        return {};
                    }
                }
            })
            .state('user.list', {
                url: '/users',
                templateUrl: '/t/user/userList.html',
                controller: 'UserListController',
                resolve: {
                    users: function(Api) {
                        return Api.user.query();
                    }
                }
            })
            .state('user.projects', {
                url: '/projects/:active?',
                templateUrl: '/t/project/list.html',
                controller: 'ProjectController',
                resolve: {
                    active: function($stateParams) {
                        return $stateParams.active;
                    }
                }
            })
            .state('user.history', {
                url: '/history',
                templateUrl: '/t/history/list.html',
                controller: 'HistoryController',
                resolve: {
                    history: function(HistoryFactory) {
                        return HistoryFactory.query();
                    }
                }
            })
            .state('user.api', {
                url: '/api',
                templateUrl: '/t/api/list.html',
                controller: 'ApiController',
                resolve: {
                    apis: function(Api) {
                        return Api.apis.query();
                    }
                }
            })
            .state('user.teams', {
                url: '/teams',
                templateUrl: '/t/team/teamList.html',
                controller: 'TeamListController',
                resolve: {
                    teams: function(Api) {
                        return Api.team.query();
                    }
                }
            })
            .state('user.404', {
                url: '/404',
                templateUrl: '/t/error/404.html'
            });

        $urlRouterProvider.otherwise('/404');

        jwtInterceptorProvider.tokenGetter = function(config, AuthFactory) {
            var idToken = AuthFactory.getToken();

            if (config.url.substr(config.url.length - 5) == '.html') {
                return null;
            }

            if (idToken && AuthFactory.tokenExpired()) {
                return AuthFactory.refreshToken();
            }

            return idToken;
        };

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push('AuthInterceptor');
    }
})();

(function() {
    angular
        .module('xApp')
        .factory('Api', apiFactory);

    function apiFactory($resource) {
        return {
            auth: $resource("/internal/auth"),
            project: $resource("/api/project/:id", null, enableCustom),
            projectKeys: $resource("/api/project/keys/:id"),
            projectOwner: $resource("/api/project/changeOwner/:id", null, enableCustom),
            assignedTeams: $resource("/api/project/teams/:id", null, enableCustom),
            user: $resource("/api/user/:id", null, enableCustom),
            apis: $resource("/api/apis/:id", null, enableCustom),
            team: $resource("/api/team/:id", null, enableCustom),
            teamMembers: $resource("/api/teamMembers/:id", null, enableCustom),
            projectTeams: $resource("/api/projectTeams/:id", null, enableCustom),
            entryTeams: $resource("/api/entryTeams/:id", null, enableCustom),
            entryTags: $resource("/api/entryTags/:id", null, enableCustom),
            authStatus: $resource("/internal/auth/status", null),
            profile: $resource("/api/profile", null, enableCustom),
            share: $resource("/api/share/:id", null, enableCustom),
            entry: $resource("/api/entry/:id", null, angular.extend(enableCustom, {
                password: { method: 'GET', params: {id: '@id'} }
            })),
            entryAccess: $resource("/api/entry/access/:id", null),
            entryPassword: $resource("/api/entry/password/:id", {}, {
                password: { method: 'GET', params: {id: '@id'} }
            })
        }
    }

    var enableCustom = {
        update: {
            method: 'PUT', params: {id: '@id'}
        },
        delete: {
            method: 'DELETE', params: {id: '@id'}
        }
    };
})();

(function() {
    angular
        .module('xApp')
        .controller('ApiController', ctrl);

    function ctrl($scope, Api, apis) {
        $scope.apis = apis;
        $scope.revoke = revoke;

        $scope.$on('key:create', onKeyCreate);

        function revoke(api) {
            if (!confirm('Are you sure?')) {
                return;
            }

            Api.apis.remove({id: api.id});
            $scope.apis.splice($scope.apis.map(function(x) { return x.id; }).indexOf(api.id), 1);
        }

        function onKeyCreate(e, key) {
            $scope.apis.push(key);
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('AuthController', authController);

    function authController($scope, AuthFactory) {
        $scope.login = login;

        function login() {
            AuthFactory.initLogin($scope.email, $scope.password, $scope.remember);
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .factory('AuthFactory', auth);

    function auth($rootScope, $sanitize, $http, $location, Api, toaster, jwtHelper) {
        var localToken = 'auth_token';
        var refreshingToken = null;

        return {
            login: login,
            logout: logout,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            initLogin: initLogin,
            getToken: getToken,
            tokenExpired: tokenExpired,
            setToken: setToken,
            refreshToken: refreshToken
        };

        function getToken() {
            return localStorage.getItem(localToken);
        }

        function setToken(token) {
            localStorage.setItem(localToken, token);
        }

        function login(token) {
            setToken(token);
            $rootScope.$broadcast('auth:login', getUser());
        }

        function logout() {
            localStorage.removeItem(localToken);

            $rootScope.$broadcast('auth:login', null);
        }

        function getUser() {
            var token = getToken();
            if (token) {
                try {
                    return jwtHelper.decodeToken(token).user;
                } catch(err) {}
            }
            return [];
        }

        function tokenExpired() {
            return jwtHelper.isTokenExpired(getToken());
        }

        function isLoggedIn() {
            return getUser().id > 0;
        }

        function initLogin(username, password, remember) {
            Api.auth.save({
                email: $sanitize(username),
                password: $sanitize(password),
                remember: $sanitize(remember)
            }, function (response) {
                login(response.token);
                $location.path('/recent');
                toaster.pop('info', "", "Welcome back, " + getUser().name);
            }, function (response) {
                toaster.pop('error', "Login Failed", response.data[0]);
            })
        }

        function refreshToken() {
            if (refreshingToken == null) {
                refreshingToken = $http({
                    url: '/internal/auth/refresh',
                    skipAuthorization: true,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    }
                }).then(function(response) {
                    var token = response.data.token;
                    setToken(token);
                    refreshingToken = null;

                    return token;
                });
            }

            return refreshingToken;
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .factory('AuthInterceptor', authInterceptor);

    function authInterceptor($q, $injector, $location, toaster) {
        return {
            response: response,
            responseError: error
        };

        function response(response) {
            return response || $q.when(response);
        }

        function error(rejection) {
            var AuthFactory = $injector.get('AuthFactory');

            if (rejection.status === 400 || rejection.status === 401) {
                if (AuthFactory.isLoggedIn()) {
                    toaster.pop('warning', 'Session Expired', 'Please log in.');
                    AuthFactory.logout();
                }
                $location.path('/login');
            }

            if (rejection.status === 403) {
                toaster.pop('error', "Forbidden", 'You cannot access this resource.');
            }

            if (rejection.status === 419) {
                toaster.pop('warning', "Validation Error", rejection.data);
            }

            return $q.reject(rejection);
        }
    }

})();
(function () {
    angular
        .module('xApp')
        .directive('clippy', dir);

    function dir() {
        return {
            restrict: 'E',
            controller: function() {
                var enabled = localStorage.getItem('clippy') || false;

                if (String(enabled).toLowerCase() == 'true') {
                    runClippy();
                }
            }
        };
    }

    function runClippy() {
        clippy.load('Clippy', function(agent){
            agent.show();
            agent.reposition = function () {
                if (!this._el.is(':visible')) return;
                var o = this._el.offset();
                var bH = this._el.outerHeight();
                var bW = this._el.outerWidth();

                var wW = $(window).width();
                var wH = $(window).height();
                var sT = $(window).scrollTop();
                var sL = $(window).scrollLeft();
                var top = o.top - sT;
                var left = o.left - sL;
                var m = 5;
                if (top - m < 0) {
                    top = m;
                    this.hide();
                    clearInterval(loop);
                    this._balloon.hide(true);
                } else if ((top + bH + m) > wH) {
                    this.hide();
                    clearInterval(loop);
                    this._balloon.hide(true);
                    top = wH - bH - m;
                }

                if (left - m < 0) {
                    this.hide();
                    clearInterval(loop);
                    this._balloon.hide(true);
                    left = m;
                } else if (left + bW + m > wW) {
                    this.hide();
                    clearInterval(loop);
                    this._balloon.hide(true);
                    left = wW - bW - m;
                }

                this._el.css({left:left, top:top});
                // reposition balloon
                this._balloon.reposition();
            };
            agent._balloon.WORD_SPEAK_TIME = 200;
            agent._balloon.CLOSE_BALLOON_DELAY = 15000;
            var loop = setInterval(function () {
                agent.speak(fortunes[Math.floor(Math.random()*fortunes.length)]);
            }, 30000);
        });
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('copyPassword', copyPasswordDirective);

    function copyPasswordDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="download()" class="btn btn-default btn-xs" title="Copy password" ng-if="isState(\'download\')">' +
                    '<i class="glyphicon glyphicon-open"></i>' +
                '</a>' +
                '<a class="btn btn-default btn-xs" title="Please wait..." ng-if="isState(\'waiting\')">' +
                    '<i class="fa fa-spinner fa-spin"></i>' +
                '</a>' +
                '<a clip-copy="password" clip-click="copy()" class="btn btn-info btn-xs" title="Copy password" ng-if="isState(\'copy\')">' +
                    '<i class="glyphicon glyphicon-save"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($scope, Api, toaster, $rootScope) {
                $scope.state = 'download';
                $scope.isState = isState;
                $scope.download = downloadPassword;
                $scope.copy = copy;
                $scope.password = '';

                $scope.$on("PasswordRequest", function(e, entry){
                    if (entry.id != $scope.entry.id) {
                        return;
                    }

                    if ($scope.state == "download") {
                        downloadPassword();
                        return;
                    }

                    if ($scope.state == "copy") {
                        var textarea = document.createElement("textarea");
                        textarea.innerHTML = $scope.password;
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            if (document.execCommand("copy")) {
                                copy();
                            }
                        } catch (e) {}
                        document.body.removeChild(textarea);
                        $rootScope.$broadcast("AppFocus");
                    }
                });

                function isState(state) {
                    return $scope.state == state;
                }

                function copy() {
                    toaster.pop('success', "", 'Password copied to clipboard.');
                }

                function downloadPassword() {
                    $scope.state = 'waiting';
                    Api.entryPassword.password({id: $scope.entry.id}, function(response) {
                        $scope.password = response.password;
                        response.$promise.then(function() {
                            $scope.state = 'copy';
                        });
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryAccessInfo', entryAccessInfoDirective);

    function entryAccessInfoDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-primary btn-xs" title="Access Information" ng-click="info()" ng-if="!entry.can_edit">' +
                    '<i class="glyphicon glyphicon-info-sign"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.info = entryInfo;

                function entryInfo() {
                    $modal.open({
                        templateUrl: '/t/entry/access.html',
                        controller: 'ModalAccessController',
                        resolve: {
                            access: function(Api) {
                                return Api.entryAccess.query({id: $scope.entry.id});
                            }
                        }
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryCreate', entryCreateDirective);

    function entryCreateDirective($modal, $rootScope, hotkeys) {
        return {
            restrict: 'A',
            scope: {
                project: '=entryCreate'
            },

            link: function($scope, element) {
                hotkeys.add({
                    combo: 'ctrl+i',
                    description: 'Add new entry',
                    allowIn: ['input', 'select', 'textarea'],
                    callback: function(event, hotkey) {
                        openEntryModal();
                    }
                });

                element.on('click', function() {
                    openEntryModal();
                });

                function openEntryModal() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalCreateEntryController',
                        resolve: {
                            project_id: function () {
                                return $scope.project.id;
                            }
                        }
                    }).result.then(onModalSuccess, onModalDismiss);
                }

                function onModalSuccess(model) {
                    $rootScope.$broadcast('entry:create', model);
                    $rootScope.$broadcast('AppFocus');
                }

                function onModalDismiss() {
                    setTimeout(function(){ $rootScope.$broadcast("AppFocus"); }, 400);
                }

                $scope.$on('$destroy', function(){
                    hotkeys.del('ctrl+i');
                });
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryDelete', entryDeleteDirective);

    function entryDeleteDirective() {
        return {
            restrict: 'A',
            scope: {
                entry: '=entryDelete'
            },
            link: function($scope, element) {
                element.on('click', function(e){
                    $scope.delete();
                });
            },
            controller: function($rootScope, $scope, Api) {
                $scope.delete = entryDelete;

                function entryDelete() {
                    if (!confirm('Are you sure?')) {
                        return;
                    }

                    Api.entry.delete({id: $scope.entry.id});
                    $rootScope.$broadcast('entry:delete', $scope.entry);
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryShare', entryShareDirective);

    function entryShareDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="share()" class="btn btn-success btn-xs" title="Share to User">' +
                    '<i class="glyphicon glyphicon-link"></i> Share' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.share = shareEntry;

                function shareEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/share.html',
                        controller: 'ModalShareController',
                        resolve: {
                            users: function(Api) {
                                return Api.user.query();
                            },
                            access: function(Api) {
                                return Api.share.query({id: $scope.entry.id});
                            },
                            entry: function() {
                                return $scope.entry;
                            },
                            teams: function(Api) {
                                return Api.team.query();
                            },
                            entryTeams: function(Api) {
                                return Api.entryTeams.query({id: $scope.entry.id});
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:share', model);
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryTag', entryTagDirective);

    function entryTagDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="tag()" class="btn btn-link btn-xs" title="Manage Tags">' +
                    '<i class="fa fa-pencil"></i> Tags' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.tag = tagEntry;

                function tagEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/tag.html',
                        controller: 'ModalTagController',
                        resolve: {
                            entry: function() {
                                return $scope.entry;
                            },
                            tags: function(Api) {
                                return Api.entryTags.query();
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:tag', model);
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('entryUpdate', entryUpdateDirective);

    function entryUpdateDirective() {
        return {
            restrict: 'A',
            scope: {
                entry: '=entryUpdate',
                on: '='
            },
            link: function($scope, element) {
                if (!$scope.entry.can_edit) {
                    return;
                }

                element.on('click', function(e){
                    $scope.update();
                });
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateEntry;

                function updateEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalUpdateEntryController',
                        resolve: {
                            entry: function(Api) {
                                return Api.entry.get({id: $scope.entry.id});
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:update', model);
                    });
                }
            }
        };
    }
})();

/*global angular */
/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
(function () {
    angular
        .module('xApp')
        .directive('appFocus', appFocusDirective);

    function appFocusDirective($parse) {
        return function (scope, elem, attrs) {
            var select = attrs.hasOwnProperty('appFocusSelect');
            var optionsFn = angular.noop;
            if (select) {
                optionsFn = $parse(attrs.appFocusSelect) || optionsFn;
            }
            if (!attrs.appFocus) {
                focus();
            } else {
                scope.$watch(attrs.appFocus, function (newVal) {
                    if (newVal) {
                        focus();
                    }
                });
            }
            function focus() {
                setTimeout(function () {
                    elem[0].focus();
                    select && selectInput();
                }, 200);
            }

            function selectInput() {
                var options = optionsFn(scope);
                if (options) {

                    elem[0].setSelectionRange(
                        options.start || 0,
                        options.end || 0
                    );
                } else {
                    elem[0].select();
                }
                return elem[0];
            }

            scope.$on("AppFocus", function() {
                selectInput();
            });
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('keyCreate', dir);

    function dir() {
        return {
            restrict: 'E',
            template: '<a class="btn btn-default btn-xs" title="Add new key" ng-click="create()">Add new key</a>',
            controller: function($rootScope, $scope, Api, toaster) {
                $scope.create = createKey;

                function createKey() {
                    Api.apis.save({}).$promise.then(function(key) {
                        toaster.pop('success', "Key successfully created.");
                        $rootScope.$broadcast('key:create', key);
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('logout', logoutDirective);

    function logoutDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="logout()" tooltip-placement="right" tooltip="Log-out ({{login.email}})">' +
                    '<i class="fa fa-sign-out fa-2x"></i>' +
                '</a>',
            controller: function($scope, Api, AuthFactory, $location) {
                $scope.logout = logout;

                function logout() {
                    Api.auth.get({}, function() {
                        AuthFactory.logout(true);
                        $location.path('/login');
                    })
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('profile', profileDirective);

    function profileDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="profile()" tooltip-placement="right" tooltip="Edit Profile">' +
                    '<i class="fa fa-wrench fa-2x"></i>' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.profile = profile;

                function profile() {
                    $modal.open({
                        templateUrl: '/t/user/profile.html',
                        controller: 'ProfileController'
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('projectJump', projectJumpDirective);

    function projectJumpDirective() {
        return {
            restrict: 'E',
            template:
                '<div class="project-jump" ng-class="{in: isActive}"><ui-select ng-model="project" on-select="openProject($item)" focus-on="openJump">' +
                    '<ui-select-match placeholder="Quick project jump">{{ $select.selected.name }}</ui-select-match>' +
                    '<ui-select-choices repeat="project.id as pro in projects | filter: {name: $select.search}">' +
                        '<div ng-bind-html="pro.name | highlight: $select.search"></div>' +
                        '<div class="muted small">{{ pro.description }}</div>' +
                    '</ui-select-choices>' +
                '</ui-select></div>',
            scope: {
                projects: '='
            },
            controller: function($scope, $state, hotkeys) {
                $scope.openProject = openProject;
                $scope.isActive = false;

                $scope.$on('toggleJump', function () {
                    $scope.isActive = !$scope.isActive;
                    $scope.$broadcast('openJump');

                    if ($scope.isActive) {
                        hotkeys.add({
                            combo: 'esc',
                            description: 'Close project jump',
                            allowIn: ['input', 'select'],
                            callback: function() {
                                close();
                            }
                        });
                    } else {
                        close();
                    }
                });

                function close() {
                    $scope.isActive = false;
                    hotkeys.del('esc');
                }

                function openProject(project) {
                    $state.go('user.project', {projectId: project.id});
                    close();
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('projectTeam', directive);

    function directive() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-success btn-xs" title="Assign Team" ng-click="teams()" ng-if="project.can_edit">' +
                    '<i class="glyphicon glyphicon-link"></i>' +
                '</a>',
            scope: {
                project: '='
            },
            controller: function($scope, $modal) {
                $scope.teams = teams;

                function teams() {
                  $modal.open({
                      templateUrl: '/t/project-team/teams.html',
                      controller: 'ProjectTeamController',
                      resolve: {
                          teams: function(Api) {
                              return Api.team.query();
                          },
                          access: function(Api) {
                              return Api.projectTeams.query({id: $scope.project.id});
                          },
                          project: function() {
                              return $scope.project;
                          }
                      }
                  });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('projectUpdate', projectUpdateDirective);

    function projectUpdateDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-warning btn-xs" title="Edit project" ng-click="update()" ng-if="project.can_edit">' +
                    '<i class="glyphicon glyphicon-edit"></i>' +
                '</a>',
            scope: {
                project: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateProject;

                function updateProject() {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalUpdateProjectController',
                        resolve: {
                            project: function(Api) {
                                return Api.project.get({id: $scope.project.id});
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('project:update', model);
                    });
                }
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .directive('triggerChange', triggerChangeDirective);

    function triggerChangeDirective() {
        return {
            restrict: 'A',
            priority: -10,
            link: function (scope, element) {
                element.on('submit', function(){
                    angular.forEach(element.find('input'), function(field) {
                        angular.element(field).triggerHandler('change');
                    });
                });
            }
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('EntryController', controller);

    function controller($scope, $filter, hotkeys, entries, project, active, $rootScope) {

        $scope.entries = entries;
        $scope.project = project;
        $scope.active = active;
        $scope.search = {};
        $scope.tags = [];
        $scope.setActive = setActive;
        $scope.getFiltered = getFiltered;

        $scope.entries.$promise.then(function(){
            if (!$scope.active.id && $scope.entries.length > 0) {
                $scope.active = $scope.entries[0];
            }
        });

        $scope.$on('entry:create', onEntryCreate);
        $scope.$on('entry:update', onEntryUpdate);
        $scope.$on('entry:delete', onEntryDelete);
        $scope.$on('$destroy', onDestroy);
        $scope.$watch("search", onFilterChanged, true);

        hotkeys.add({
            combo: 'return',
            description: 'Download and copy password',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                $rootScope.$broadcast("PasswordRequest", $scope.active);
            }
        });


        hotkeys.add({
            combo: 'up',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var previous = getFiltered()[current - 1];
                if (previous) {
                    $scope.active = previous;
                } else {
                    $rootScope.$broadcast("AppFocus");
                }
            }
        });

        hotkeys.add({
            combo: 'down',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var next = getFiltered()[current + 1];
                if (next) {
                    $scope.active = next;
                }
            }
        });

        function onFilterChanged() {
            var filtered = getFiltered();
            var current = _.findIndex(filtered, function(x) {
                return x.id == $scope.active.id;
            });
            if (current == -1 && filtered.length > 0) {
                $scope.active = filtered[0];
            }
        }

        function getFiltered() {
            return $filter('filter')($scope.entries, { $: $scope.search.query });
        }

        function setActive(entry) {
            $scope.active = entry;
        }

        function onEntryCreate(event, model) {
            $scope.entries.push(model);
        }

        function onEntryUpdate(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries[index] = model;
            }

            setActive(model);
        }

        function onEntryDelete(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries.splice(index, 1);
            }

            setActive({});
        }

        function getEntryIndex(entry) {
            return $scope.entries.map(function(e) {return parseInt(e.id)}).indexOf(parseInt(entry.id));
        }

        function onDestroy() {
            hotkeys.del('return');
            hotkeys.del('up');
            hotkeys.del('down');
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalAccessController', function($scope, $modalInstance, access) {
        $scope.access = access;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalCreateEntryController', function($scope, $modalInstance, Api, project_id) {
        $scope.entry = {
            project_id: project_id
        };

        $scope.ok = function () {
            Api.entry.save($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.generate = function() {
            $scope.entry.password = Password.generate(16);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();


(function() {
    angular
        .module('xApp')
        .controller('ModalGetPasswordController', function($scope, $modalInstance, password, entry) {
        $scope.password = password;
        $scope.entry = entry;

        $scope.shown = false;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.shown = true;
        };

        $scope.hide = function() {
            $scope.shown = false;
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.download = function() {
            var a = document.createElement('a');
            a.href = 'data:application/octet-stream;charset=utf-8,' + encodeURI($scope.password.password);
            a.target = '_blank';
            a.download = $scope.entry.username ? $scope.entry.username : $scope.entry.id;
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
    });

})();

(function() {
    angular
        .module('xApp')
        .controller('ModalShareController', shareController);

    function shareController($scope, $modalInstance, Api, users, access, entry, teams, entryTeams) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;
        $scope.teams = teams;
        $scope.entryTeams = entryTeams;

        $scope.share = {
            user: 0,
            team: 0
        };

        $scope.users.$promise.then(function() {
            $scope.share.user = $scope.users[0] ? $scope.users[0].id : 0;
        });

        $scope.teams.$promise.then(function() {
            $scope.share.team = $scope.teams[0] ? $scope.teams[0].id : 0;
        });

        $scope.shareUser = function() {
            Api.share.save({
                user_id: $scope.share.user,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        };

        $scope.shareTeam = function() {
            Api.entryTeams.save({
                team_id: $scope.share.team,
                id: $scope.entry.id
            }, function(response) {
                $scope.entryTeams.push(response);
            });
        };

        $scope.revokeUser = function(accessId) {
            Api.share.delete({
                id: accessId
            }, function() {
                $scope.access.splice($scope.access.map(function(i) {return i.id;}).indexOf(accessId), 1);
            });
        };

        $scope.revokeTeam = function(accessId) {
            Api.entryTeams.delete({
                id: accessId
            }, function() {
                $scope.entryTeams.splice($scope.entryTeams.map(function(i) {return i.id;}).indexOf(accessId), 1);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalTagController', ctrl);

    function ctrl($scope, $modalInstance, Api, entry, tags) {
        $scope.tags = tags;
        $scope.entry = entry;

        $scope.tag_color = '#dbdbdb';
        $scope.tag_name = '';

        $scope.createTag = function() {
            Api.entryTags.save({color: $scope.tag_color, name: $scope.tag_name, entryId: entry.id}, function(res) {
                $scope.entry.tags.push(res);
                $scope.tags.push(res);
                $scope.tag_color = '#dbdbdb';
                $scope.tag_name = '';
            });
        };

        $scope.removeTag = function(tag) {
            Api.entryTags.delete({id: tag.id}, function() {
                var index = $scope.entry.tags.map(function (e) { return e.id; }).indexOf(tag.id);
                $scope.entry.tags.splice(index, 1);

                if (_.findWhere($scope.tags, {name: tag.name, entry_id: entry.id})) {
                    var tagIndex = $scope.tags.map(function (e) { return e.name; }).indexOf(tag.name);
                    $scope.tags.splice(tagIndex, 1);
                }
            });
        };

        $scope.addTag = function(tag) {
            Api.entryTags.save({color: tag.color, name: tag.name, entryId: entry.id}, function(res) {
                $scope.entry.tags.push(res);
            });
        };

        $scope.availableTags = function() {
            return _.filter($scope.tags, function(obj) {
                return !_.findWhere($scope.entry.tags, {name: obj.name});
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalUpdateEntryController', ctrl);

    function ctrl($scope, $modalInstance, Api, entry, GROUPS) {
        $scope.entry = entry;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            Api.entry.update($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.generate = function() {
            if (confirm('Replace password with random one?')) {
                $scope.entry.password = Password.generate(16);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .constant('GROUPS', {
            admin: 'Administrator',
            dev: 'Developer',
            tester: 'Tester',
            pm: 'Project Manager'
        });
})();

var Password = {

    _pattern : /[a-zA-Z0-9_\-\+\.]/,


    _getRandomByte : function()
    {
        // http://caniuse.com/#feat=getrandomvalues
        if(window.crypto && window.crypto.getRandomValues)
        {
            var result = new Uint8Array(1);
            window.crypto.getRandomValues(result);
            return result[0];
        }
        else if(window.msCrypto && window.msCrypto.getRandomValues)
        {
            var result = new Uint8Array(1);
            window.msCrypto.getRandomValues(result);
            return result[0];
        }
        else
        {
            return Math.floor(Math.random() * 256);
        }
    },

    generate : function(length)
    {
        return Array.apply(null, {'length': length})
            .map(function()
            {
                var result;
                while(true)
                {
                    result = String.fromCharCode(this._getRandomByte());
                    if(this._pattern.test(result))
                    {
                        return result;
                    }
                }
            }, this)
            .join('');
    }

};

(function() {
    angular
        .module('xApp')
        .directive('loader', loaderDirective)
        .directive('showPassword', showPasswordDirective)
        .directive('clipCopy', clipCopyDirective)
        .directive('fileRead', fileReadDirective)
        .directive('changeProjectOwner', projectOwnerDirective);

    function loaderDirective() {
        return {
            restrict: 'E',
            scope: {
                when: '='
            },
            template: '<img src="/img/loader.gif" ng-show="when" class="loader">'
        };
    }

    function clipCopyDirective() {
        return {
            scope: {
                clipCopy: '&',
                clipClick: '&'
            },
            restrict: 'A',
            link: function (scope, element, attrs) {
                // Create the clip object
                var clip = new ZeroClipboard(element);
                clip.on( 'load', function(client) {
                    var onDataRequested = function (client) {
                        client.setText(scope.$eval(scope.clipCopy));

                        if (angular.isDefined(attrs.clipClick)) {
                            scope.$apply(scope.clipClick);
                        }
                    };
                    client.on('dataRequested', onDataRequested);

                    scope.$on('$destroy', function() {
                        client.off('dataRequested', onDataRequested);
                        client.unclip(element);
                    });
                });
            }
        };
    }

    function showPasswordDirective() {
        return {
            scope: {
                entry: '=showPassword'
            },
            restrict: 'A',
            link: function($scope, element) {
                if (!$scope.entry.can_edit) {
                    return;
                }

                element.on('click', function(e){
                    $scope.showPassword();
                });
            },
            controller: function($scope, $modal, modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-info btn-xs';
                $scope.showPassword = showPasswordModal;

                function showPasswordModal() {
                    modal.showPassword($scope.entry.id);
                }
            }
        };
    }

    function fileReadDirective() {
        return {
            restrict: 'A',
            scope: {
                content: '=',
                name: '='
            },
            link: function(scope, element, attrs) {
                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();
                    var file = (onChangeEvent.srcElement || onChangeEvent.target).files[0];

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            scope.content = onLoadEvent.target.result;
                            scope.name = file.name;
                        });
                    };
                    reader.readAsText(file);
                });
            }
        };
    }

    function projectOwnerDirective() {
        return {
            scope: {
                projectId: '=',
                elementClass: '=?'
            },
            template:
                '<a ng-click="showModal()" ng-class="elementClass" title="Change Project Owner">' +
                '    <i class="glyphicon glyphicon-share-alt"></i>' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-default';
                $scope.showModal = showModal;

                function showModal() {
                    $modal.open({
                        templateUrl: '/t/project/changeOwner.html',
                        controller: 'ModalChangeProjectOwnerController',
                        resolve: {
                            users: function(Api) {
                                return Api.user.query();
                            },
                            project: function(Api) {
                                return Api.project.get({id: $scope.projectId});
                            }
                        }
                    });
                }
            }
        };
    }

})();

(function() {
    angular
        .module('xApp')
        .filter('userGroup', groupFilter)
        .filter('nl2br', nl2brFilter);

    function groupFilter(GROUPS) {
        return function(input) {
            return GROUPS[input];
        }
    }

    function nl2brFilter($sce) {
        return function(message, xhtml) {
            var is_xhtml = xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (message + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');

            return $sce.trustAsHtml(msg);
        }
    }
})();

(function () {
    angular
        .module('xApp')
        .factory('modal', modal);

    function modal($modal) {
        return {
            showPassword: showPassword
        };

        function showPassword(entryId) {
            return $modal.open({
                templateUrl: '/t/entry/password.html',
                controller: 'ModalGetPasswordController',
                resolve: {
                    password: function (Api) {
                        return Api.entryPassword.password({id: entryId});
                    },
                    entry: function (Api) {
                        return Api.entry.get({id: entryId});
                    }
                }
            });
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('HistoryController', function($scope, history) {
            $scope.history = history;
        })
        .factory('HistoryFactory', function ($resource) {
            return $resource("/api/history", {}, {
                query: { method: 'GET', isArray: true }
            })
        });
})();

(function() {
    angular
        .module('xApp')
        .controller('HomeController', function($scope, recent, hotkeys, $rootScope) {
            $scope.recent = recent;
            $scope.active = {};
            $scope.setActive = setActive;
            $scope.$on('$destroy', onDestroy);

            hotkeys.add({
                combo: 'return',
                description: 'Download and copy password',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    $rootScope.$broadcast("PasswordRequest", $scope.active);
                }
            });

            hotkeys.add({
                combo: 'up',
                description: 'Show project jump window',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex($scope.recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var previous = $scope.recent[current - 1];
                    if (previous) {
                        $scope.active = previous;
                    }
                }
            });

            hotkeys.add({
                combo: 'down',
                description: 'Show project jump window',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex($scope.recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var next = $scope.recent[current + 1];
                    if (next) {
                        $scope.active = next;
                    }
                }
            });

            function setActive(entry) {
                $scope.active = entry;
            }

            function onDestroy() {
                hotkeys.del('return');
                hotkeys.del('up');
                hotkeys.del('down');
            }
        })
        .factory('RecentFactory', function ($resource) {
            return $resource("/api/recent", {}, {
                query: { method: 'GET', isArray: true }
            });
        });
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalChangeProjectOwnerController', ctrl);

    function ctrl($scope, $modalInstance, toaster, Api, users, project) {
        $scope.users = users;
        $scope.project = project;
        $scope.form = {owner: 0, assign: 0};

        $scope.project.$promise.then(function() {
            $scope.form.owner = $scope.project.user_id;
        });

        $scope.ok = function () {
            Api.projectOwner.get({
                id: $scope.project.id,
                owner: $scope.form.owner,
                assign: $scope.form.assign
            }, function() {
                $modalInstance.close();
                toaster.pop('success', 'Project owner has been changed.');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalCreateProjectController', ctrl);

    function ctrl($scope, $modalInstance, Api) {
        $scope.project = {};

        $scope.ok = function () {
            Api.project.save($scope.project,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();


(function() {
    angular
        .module('xApp')
        .controller('ModalProjectOwnerController', ctrl);

    function ctrl($scope, $modalInstance, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalUpdateProjectController', ctrl);

    function ctrl($scope, $modalInstance, Api, project) {
        $scope.project = project;

        $scope.ok = function() {
            Api.project.update(
                $scope.project,
                function() {
                    $modalInstance.close($scope.project);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ProjectController', controller);

    function controller($scope, $modal, Api, $filter, projects, active, hotkeys, $state) {

        $scope.projects = projects;
        $scope.active = {id: active};
        $scope.create = createProject;
        $scope.getFiltered = getFiltered;
        $scope.teams = teamsAssigned;
        $scope.info = projectOwnerInfo;
        $scope.delete = deleteProject;
        $scope.setActive = setActive;
        $scope.goTo = goTo;
        $scope.search = {query: ''};
        $scope.$watch("search", onFilterChanged, true);
        $scope.projects.$promise.then(function(){
            if (!$scope.active.id && $scope.projects.length > 0) {
                $scope.active = $scope.projects[0];
            }
        });

        function onFilterChanged() {
            var filtered = getFiltered();
            var current = _.findIndex(filtered, function(x) {
                return x.id == $scope.active.id;
            });
            if (current == -1 && filtered.length > 0) {
                $scope.active = filtered[0];
            }
        }

        function createProject() {
            $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalCreateProjectController'
            }).result.then(function (model) {
                $scope.projects.push(model);
            });
        }

        function teamsAssigned(project) {
            $modal.open({
                templateUrl: '/t/project-team/assigned.html',
                controller: 'AssignedTeamController',
                resolve: {
                    teams: function(Api) {
                        return Api.assignedTeams.query({id: project.id});
                    }
                }
            });
        }

        function projectOwnerInfo(project) {
            $modal.open({
                templateUrl: '/t/project/owner.html',
                controller: 'ModalProjectOwnerController',
                resolve: {
                    owner: function(Api) {
                        return Api.user.get({id: project.user_id});
                    }
                }
            });
        }

        function deleteProject(project) {
            if (!confirm('Are you sure?')) {
                return;
            }

            Api.project.delete({id: project.id});
            $scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1);
        }

        function getFiltered() {
            return $filter('filter')($scope.projects, { $: $scope.search.query });
        }

        function setActive(entry) {
            $scope.active = entry;
        }

        hotkeys.add({
            combo: 'up',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var previous = getFiltered()[current - 1];
                if (previous) {
                    $scope.active = previous;
                }
            }
        });

        hotkeys.add({
            combo: 'down',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var next = getFiltered()[current + 1];
                if (next) {
                    $scope.active = next;
                }
            }
        });

        function goTo(project){
            $state.go('user.project', {projectId: project.id});
        }


        hotkeys.add({
            combo: 'return',
            description: 'Open project',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                $state.go("user.project", {projectId: $scope.active.id});
            }
        });

        $scope.$on('$destroy', function(){
            hotkeys.del('return');
            hotkeys.del('up');
            hotkeys.del('down');
        });
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('AssignedTeamController', teamController);

    function teamController($scope, $modalInstance, teams) {
        $scope.teams = teams;

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ProjectTeamController', teamController);

    function teamController($scope, $modalInstance, Api, teams, project, access) {
        $scope.teams = teams;
        $scope.access = access;
        $scope.project = project;

        $scope.canAccess = function(team) {
            return getAccessIndexForUserId(team.id) != -1;
        };

        $scope.grant = function(team) {
            Api.projectTeams.save({
                team_id: team.id,
                project_id: $scope.project.id
            }, function (response) {
                $scope.access.push(response);
            });
        };

        $scope.revoke = function(team) {
            var accessIndex = getAccessIndexForUserId(team.id);

            Api.projectTeams.delete({
                id: $scope.access[accessIndex].id
            }, function() {
                $scope.access.splice(accessIndex, 1);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        function getAccessIndexForUserId(teamId) {
            return $scope.access.map(function (e) { return e.team_id; }).indexOf(teamId);
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('createTeamController', createTeamController);

    function createTeamController($scope, $modalInstance, Api) {
        $scope.team = {};

        $scope.ok = save;
        $scope.cancel = cancel;

        function save() {
            Api.team.save($scope.team, function(response) {
                $modalInstance.close(response);
            });
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('TeamListController', teamListController);

    function teamListController($rootScope, $scope, $modal, $filter, Api, toaster, teams) {
        $scope.teams = teams;

        $scope.create = create;
        $scope.update = update;
        $scope.remove = remove;
        $scope.members = members;

        $rootScope.$on('teamMemberAdded', onTeamMemberAdded);
        $rootScope.$on('teamMemberRemoved', onTeamMemberRemoved);

        function create() {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'createTeamController'
            }).result.then(function (model) {
                $scope.teams.push(model);
            });
        };

        function update(teamId) {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'updateTeamController',
                resolve: {
                    team: function(Api) {
                        return Api.team.get({id: teamId});
                    }
                }
            }).result.then(function (model) {
                $scope.teams[$scope.teams.map(function(e) {return e.id}).indexOf(teamId)] = model;
            });
        };

        function remove(teamId) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.team.delete({id: teamId}, function() {
                var teamIndex = $scope.teams.map(function(e) {return e.id}).indexOf(teamId);
                toaster.pop('info', "Team Deleted", 'Team "' + $scope.teams[teamIndex].name + '" has been deleted.');
                $scope.teams.splice(teamIndex, 1);
            });
        };

        function members(teamId) {
            $modal.open({
                templateUrl: '/t/team/members.html',
                controller: 'teamMembersController',
                resolve: {
                    users: function(Api) {
                        return Api.user.query();
                    },
                    access: function(Api) {
                        return Api.teamMembers.query({id: teamId});
                    },
                    team: function() {
                        return $scope.teams[$scope.teams.map(function(c) {return c.id}).indexOf(teamId)];
                    }
                }
            });
        };

        function onTeamMemberAdded(event, data) {
            $scope.teams[$scope.teams.indexOf(data.team)].users.push(data.member);
        }

        function onTeamMemberRemoved(event, data) {
            var teamIndex = $scope.teams.indexOf(data.team);
            var users = $scope.teams[teamIndex].users;
            users.splice(users.map(function (e) { return e.id; }).indexOf(data.userId), 1);
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('teamMembersController', controller);

    function controller($rootScope, $scope, $modalInstance, Api, users, access, team) {
        $scope.users = users;
        $scope.access = access;
        $scope.team = team;

        $scope.users.$promise.then(removeOwnerFromList);

        $scope.canAccess = function(user) {
            return getAccessIndexForUserId(user.id) != -1;
        };

        $scope.grant = function(user) {
            Api.teamMembers.save({
                user_id: user.id,
                id: $scope.team.id
            }, function(response) {
                $scope.access.push(response);
                $rootScope.$broadcast('teamMemberAdded', {member: user, team: $scope.team});
            });
        };

        $scope.revoke = function(user) {
            var accessIndex = getAccessIndexForUserId(user.id);

            Api.teamMembers.delete({
                id: $scope.access[accessIndex].id
            }, function () {
                $scope.access.splice(accessIndex, 1);
                $rootScope.$broadcast('teamMemberRemoved', {userId: user.id, team: $scope.team});
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        function getAccessIndexForUserId(userId) {
            return $scope.access.map(function (e) { return e.user_id; }).indexOf(userId);
        }

        function removeOwnerFromList() {
            $scope.users.splice(
                $scope.users.map(function (e) { return e.id; }).indexOf($scope.team.user_id),
                1
            );
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('updateTeamController', updateTeamController);

    function updateTeamController($scope, $modalInstance, Api, team) {
        $scope.team = team;

        $scope.ok = update;
        $scope.cancel = cancel;

        function update() {
            Api.team.update($scope.team, function() {
                $modalInstance.close($scope.team);
            });
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ModalCreateUserController', ctrl);

    function ctrl($scope, $modalInstance, Api, GROUPS) {
        $scope.user = {};
        $scope.groups = GROUPS;

        $scope.ok = function () {
            Api.user.save($scope.user,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();


(function() {
    angular
        .module('xApp')
        .controller('ModalUpdateUserController', ctrl);

    function ctrl($scope, $modalInstance, Api, user, GROUPS) {
        $scope.user = user;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            Api.user.update($scope.user,
                function() {
                    $modalInstance.close($scope.user);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('ProfileController', ctrl);

    function ctrl($scope, $modalInstance, toaster, Api) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.clippy = String(localStorage.getItem('clippy')) == 'false';

        $scope.ok = function() {
            Api.profile.save($scope.profile,
                function() {
                    toaster.pop('success', 'Password successfully changed!');
                    $modalInstance.close();
                }
            );
        };

        $scope.toggleClippy = function() {
            localStorage.setItem('clippy', $scope.clippy);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('UserListController', controller);

    function controller($scope, $modal, $timeout, toaster, Api, AuthFactory, users) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalCreateUserController'
            });

            modalInstance.result.then(function (model) {
                $scope.users.push(model);
            });
        };

        $scope.updateUser = function(userId) {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalUpdateUserController',
                resolve: {
                    user: function(Api) {
                        return Api.user.get({id: userId});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.users[$scope.users.map(function(e) {return e.id}).indexOf(userId)] = model;
            });
        };

        $scope.deleteUser = function(userId) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.user.delete({id: userId}, function() {
                $scope.users.splice($scope.users.map(function(e) {return e.id}).indexOf(userId), 1);
            });
        };
    }
})();
