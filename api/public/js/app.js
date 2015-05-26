var xApp = angular.module('xApp', [
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'shareFlash',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'angularMoment',
    'toaster',
    'angular-jwt'
]);

xApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'uiSelectConfig',
    'jwtInterceptorProvider',
function($stateProvider, $urlRouterProvider, $httpProvider, uiSelectConfig, jwtInterceptorProvider) {

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
            controller: function($scope, $rootScope, $location, $modal, projects, AuthFactory, Api, $filter, $state) {
                $scope.projects = projects;

                $scope.login = AuthFactory.getUser();

                $scope.projectTeams = teams;
                $scope.assignedTeams = teamsAssigned;

                var sidebarOpen = false;

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

                function teams(project) {
                    $modal.open({
                        templateUrl: '/t/project-team/teams.html',
                        controller: 'ProjectTeamController',
                        resolve: {
                            teams: function(Api) {
                                return Api.team.query();
                            },
                            access: function(Api) {
                                return Api.projectTeams.query({id: project.id});
                            },
                            project: function() {
                                return project;
                            }
                        }
                    });
                }

                $(document).on('click', '.site-overlay', function() {
                    $scope.toggle(true);
                }).on('keyup', function(e) {
                    if (e.keyCode == 27 && sidebarOpen && !$('.modal').length) {
                        $scope.toggle(true);
                    }
                });

                $scope.updateProject = function(project) {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalUpdateProjectController',
                        resolve: {
                            project: function(Api) {
                                return Api.project.get({id: project.id});
                            }
                        }
                    }).result.then(function (model) {
                        $scope.projects[$scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1)] = model;
                    });
                };

                $scope.projectOwnerInfo = function(project) {
                    $modal.open({
                        templateUrl: '/t/project/owner.html',
                        controller: 'ModalProjectOwnerController',
                        resolve: {
                            owner: function(Api) {
                                return Api.user.get({id: project.user_id});
                            }
                        }
                    });
                };

                $scope.deleteProject = function(project) {
                    if (!confirm('Are you sure?')) {
                        return;
                    }
                    Api.project.delete({id: project.id});
                    $scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1);

                    $location.path('/recent');
                };

                $scope.openFirst = function ($event) {
                    if ($event.which === 13) {
                        var project = $filter('filter')(projects, $scope.projectFilter)[0];
                        if (project) {
                            $location.path('/project/' + project.id);
                        }
                    }
                };

                $scope.createProject = function() {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    }).result.then(function (model) {
                        $scope.projects.push(model);
                    });
                };

                $scope.toggle = function(close) {
                    if ($('.pushy').hasClass('pushy-open') || close) {
                        $('.pushy').removeClass("pushy-open");
                        $('#container').removeClass("container-push");
                        $('body').removeClass("pushy-active");
                        sidebarOpen = false;
                    } else {
                        $('.pushy').addClass("pushy-open");
                        $('#container').addClass("container-push");
                        $('body').addClass("pushy-active");
                        sidebarOpen = true;
                    }
                }
            },
            resolve: {
                projects: function(ProjectsFactory) {
                    return ProjectsFactory.query();
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
            url: '/project/:projectId',
            views: {
                head: {
                    templateUrl: '/t/project/pageHeader.html',
                    controller: 'ProjectController',
                    resolve: {
                        projects: function(projects) {
                            return projects;
                        }
                    }
                },
                content: {
                    templateUrl: '/t/entry/list.html',
                    controller: 'EntryController',
                    resolve: {
                        entries: function(ProjectKeysFactory, projectId) {
                            return ProjectKeysFactory.keys({id: projectId});
                        }
                    }
                }
            },
            resolve: {
                projectId: function ($stateParams) {
                    return $stateParams.projectId;
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
}]);

(function() {
    angular
        .module('xApp')
        .factory('Api', apiFactory);

    function apiFactory($resource) {
        return {
            auth: $resource("/internal/auth"),
            project: $resource("/api/project/:id", null, enableCustom),
            projectOwner: $resource("/api/project/changeOwner/:id", null, enableCustom),
            assignedTeams: $resource("/api/project/teams/:id", null, enableCustom),
            user: $resource("/api/user/:id", null, enableCustom),
            team: $resource("/api/team/:id", null, enableCustom),
            teamMembers: $resource("/api/teamMembers/:id", null, enableCustom),
            projectTeams: $resource("/api/projectTeams/:id", null, enableCustom),
            entryTeams: $resource("/api/entryTeams/:id", null, enableCustom),
            authStatus: $resource("/internal/auth/status", null),
            profile: $resource("/api/profile", null, enableCustom),
            share: $resource("/api/share/:id", null, enableCustom),
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

        function logout(withMessage) {
            localStorage.removeItem(localToken);

            if (withMessage) {
                toaster.pop('info', "", "Good bye!");
            }

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
                '<a clip-copy="password" clip-click="copy()" class="btn btn-info btn-xs" title="Copy password" ng-if="isState(\'copy\')">' +
                    '<i class="glyphicon glyphicon-save"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($scope, Api, toaster) {
                $scope.state = 'download';
                $scope.isState = isState;
                $scope.download = downloadPassword;
                $scope.copy = copy;
                $scope.password = '';

                function isState(state) {
                    return $scope.state == state;
                }

                function copy() {
                    toaster.pop('success', "", 'Password copied to clipboard.');
                }

                function downloadPassword() {
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
                            access: function(EntryAccessFactory) {
                                return EntryAccessFactory.query({id: $scope.entry.id});
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

    function entryCreateDirective() {
        return {
            restrict: 'E',
            template: '<a class="btn btn-default btn-xs" title="Add new key" ng-click="create()">Add new key</a>',
            scope: {
                projectId: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.create = createEntry;

                function createEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalCreateEntryController',
                        resolve: {
                            project_id: function() {
                                return $scope.projectId;
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:create', model);
                    });
                }
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
            restrict: 'E',
            template:
                '<a ng-click="delete()" class="btn btn-danger btn-xs" title="Remove">' +
                    '<i class="glyphicon glyphicon-trash"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, EntryFactory) {
                $scope.delete = entryDelete;

                function entryDelete() {
                    if (!confirm('Are you sure?')) {
                        return;
                    }

                    EntryFactory.delete({id: $scope.entry.id});
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
                    '<i class="glyphicon glyphicon-link"></i>' +
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
        .directive('entryUpdate', entryUpdateDirective);

    function entryUpdateDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="update()" class="btn btn-warning btn-xs" title="Update">' +
                    '<i class="glyphicon glyphicon-edit"></i>' +
                '</a>',
            scope: {
                entryId: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateEntry;

                function updateEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalUpdateEntryController',
                        resolve: {
                            entry: function(EntryFactory) {
                                return EntryFactory.show({id: $scope.entryId});
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
                '<a class="btn btn-side-menu" ng-click="logout()" title="Log Out ({{login.email}})">' +
                    '<span class="glyphicon glyphicon-off"></span><br>Logout' +
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
                '<a class="btn btn-side-menu" ng-click="profile()" title="Change Account Password">' +
                    '<span class="glyphicon glyphicon-wrench"></span><br>Profile' +
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
                '<ui-select ng-model="project" on-select="openProject($item)" class="project-jump">' +
                    '<ui-select-match>Quick project jump</ui-select-match>' +
                    '<ui-select-choices repeat="project.id as pro in projects | filter: {name: $select.search}">' +
                        '{{ pro.name }} <div class="muted small">{{ pro.description }}</div>' +
                    '</ui-select-choices>' +
                '</ui-select>',
            scope: {
                projects: '='
            },
            controller: function($scope, $state) {
                $scope.openProject = openProject;

                function openProject(project) {
                    $state.go('user.project', {projectId: project.id});
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

xApp.
    controller('ProfileController', function($scope, $modalInstance, toaster, Api) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.ok = function () {
            Api.profile.save($scope.profile,
                function() {
                    toaster.pop('success', 'Password successfully changed!');
                    $modalInstance.close();
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

xApp.constant('GROUPS', {
    admin: 'Administrator',
    dev: 'Developer',
    tester: 'Tester',
    pm: 'Project Manager'
});
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
                entryId: '=',
                'elementClass': '=?'
            },
            restrict: 'EA',
            template:
                '<a ng-click="showPassword()" ng-class="elementClass" title="Display Password">' +
                '    <i class="glyphicon glyphicon-lock"></i>' +
                '</a>',
            controller: function($scope, $modal, modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-info btn-xs';
                $scope.showPassword = showPasswordModal;

                function showPasswordModal() {
                    modal.showPassword($scope.entryId);
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

xApp.
    filter('userGroup', function(GROUPS) {
        return function(input) {
            return GROUPS[input];
        }
    });

angular.module('shareFlash', [])
    .factory('shareFlash', ['$rootScope', '$timeout', function($rootScope, $timeout) {
        var messages = [];

        var reset;
        var cleanup = function() {
            $timeout.cancel(reset);
            reset = $timeout(function() { messages = []; });
        };

        var emit = function() {
            $rootScope.$emit('flash:message', messages, cleanup);
        };

        $rootScope.$on('$locationChangeSuccess', emit);
        $rootScope.$on('closeFlash', emit);

        var asMessage = function(level, text) {
            if (!text) {
                text = level;
                level = 'success';
            }
            return { level: level, text: text };
        };

        var asArrayOfMessages = function(level, text) {
            if (level instanceof Array) return level.map(function(message) {
                return message.text ? message : asMessage(message);
            });
            return text ? [{ level: level, text: text }] : [asMessage(level)];
        };

        var flash = function(level, text) {
            if (level == []) {
                emit([]);
                return;
            }
            emit(messages = asArrayOfMessages(level, text));
        };

        ['error', 'warning', 'info', 'success'].forEach(function (level) {
            flash[level] = function (text) { flash(level, text); };
        });

        return flash;
    }])

    .directive('flashMessages', [function() {
        var directive = { restrict: 'EA', replace: true };
        directive.template = '<div class="flash-message" ng-if="messages.length > 0"><div ng-repeat="m in messages" class="alert alert-{{m.level}} text-center" ng-click="closeFlash()">{{m.text}}</div></div>';

        directive.controller = ['$scope', '$rootScope', function($scope, $rootScope) {
            $rootScope.$on('flash:message', function(_, messages, done) {
                $scope.messages = messages;
                done();
            });

            $scope.closeFlash = function() {
                $rootScope.$emit('closeFlash');
            }
        }];

        return directive;
    }]);
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
                    entry: function (EntryFactory) {
                        return EntryFactory.show({id: entryId});
                    }
                }
            });
        }
    }
})();

(function() {
    angular
        .module('xApp')
        .controller('EntryController', controller);

    function controller($rootScope, $scope, $location, $filter, modal, entries, projectId) {

        $scope.entries = entries;
        $rootScope.projectId = projectId;
        $scope.activeEntry = $location.search().active || 0;
        $scope.copyFirst = copyFirst;

        $scope.$on('entry:create', onEntryCreate);
        $scope.$on('entry:update', onEntryUpdate);
        $scope.$on('entry:delete', onEntryDelete);

        function copyFirst($event) {
            if ($event.which === 13) {
                var entry = $filter('filter')($scope.entries, $scope.search)[0];
                if (entry) {
                    modal.showPassword(entry.id);
                }
            }
        }

        function onEntryCreate(event, model) {
            $scope.entries.push(model);
        }

        function onEntryUpdate(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries[index] = model;
            }
        }

        function onEntryDelete(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries.splice(index, 1);
            }
        }

        function getEntryIndex(entry) {
            return $scope.entries.map(function(e) {return parseInt(e.id)}).indexOf(parseInt(entry.id));
        }
    }
})();

xApp
    .factory('EntriesFactory', function ($resource) {
        return $resource("/api/entry", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('EntryFactory', function ($resource) {
        return $resource("/api/entry/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            password: { method: 'GET', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('EntryAccessFactory', function ($resource) {
        return $resource("/api/entry/access/:id", {}, {
            query: { method: 'GET', params: {id: '@id'}, isArray: true }
        })
    });

xApp
    .controller('ModalAccessController', function($scope, $modalInstance, access) {
        $scope.access = access;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('ModalCreateEntryController', function($scope, $modalInstance, EntriesFactory, shareFlash, project_id) {
        $scope.entry = {
            project_id: project_id
        };

        $scope.ok = function () {
            EntriesFactory.create($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                },
                function(err) {
                    shareFlash('danger', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

xApp
    .controller('ModalGetPasswordController', function($scope, $modalInstance, password, entry) {
        $scope.password = password;
        $scope.entry = entry;

        $scope.shown = false;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.shown = true;
        }

        $scope.hide = function() {
            $scope.shown = false;
        }

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
            $scope.share.user = $scope.users[0].id || 0;
        });

        $scope.teams.$promise.then(function() {
            $scope.share.team = $scope.teams[0].id || 0;
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

xApp
    .controller('ModalUpdateEntryController', function($scope, $modalInstance, EntryFactory, shareFlash, entry, GROUPS) {
        $scope.entry = entry;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            EntryFactory.update($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                },
                function(err) {
                    shareFlash('danger', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('HistoryController', function($scope, history) {
        $scope.history = history;
    })
    .factory('HistoryFactory', function ($resource) {
        return $resource("/api/history", {}, {
            query: { method: 'GET', isArray: true }
        })
    });
xApp
    .controller('HomeController', function($scope, recent) {
        $scope.recent = recent;
    })
    .factory('RecentFactory', function ($resource) {
        return $resource("/api/recent", {}, {
            query: { method: 'GET', isArray: true }
        });
    });
xApp
    .controller('ModalChangeProjectOwnerController', function($scope, $modalInstance, toaster, Api, users, project) {
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
    });

xApp
    .controller('ModalCreateProjectController', function($scope, $modalInstance, ProjectsFactory) {
        $scope.project = {};

        $scope.ok = function () {
            ProjectsFactory.create($scope.project,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
xApp
    .controller('ModalProjectOwnerController', function($scope, $modalInstance, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('ModalUpdateProjectController', function($scope, $modalInstance, Api, project) {
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
    });
xApp
    .controller('ProjectController', function($rootScope, $scope, shareFlash, $modal, $location, projects, projectId, ProjectFactory) {

        $scope.projects = projects;
        $scope.projectId = projectId;

        $rootScope.projectId = projectId;

        $scope.getProject = function() {
            return $scope.projects[getProjectIndexById($scope.projectId)];
        };

        var getProjectIndexById = function(projectId) {
            for (var p in $scope.projects) {
                if ($scope.projects[p].id == projectId) {
                    return p;
                }
            }
        };

        $scope.setProject = function(model) {
            return $scope.projects[getProjectIndexById(model.id)] = model;
        };

    })
    .factory('ProjectsFactory', function ($resource) {
        return $resource("/api/project", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('ProjectFactory', function ($resource) {
        return $resource("/api/project/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} },
            keys: { method: 'GET', params: {id: '@id'} }
        })
    })
    .factory('ProjectKeysFactory', function ($resource) {
        return $resource("/api/project/keys/:id", {}, {
            keys: { method: 'GET', params: {id: '@id'}, isArray: true  }
        })
    });

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

xApp
    .controller('ModalCreateUserController', function($scope, $modalInstance, Api, GROUPS) {
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
    });

xApp
    .controller('ModalUpdateUserController', function($scope, $modalInstance, Api, user, GROUPS) {
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
    });

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
