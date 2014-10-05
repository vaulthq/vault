var xApp = angular.module('xApp', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'shareFlash',
    'ui.bootstrap',
    'ui.router',
 //   'chieffancypants.loadingBar',
    'ngScrollbar',
    'angularMoment'
]);

xApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
 //   'cfpLoadingBarProvider',
function($stateProvider, $urlRouterProvider, $httpProvider) {

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
            controller: function($location, Api, AuthFactory) {
                Api.authStatus.get({}, function(response) {
                    AuthFactory.login(response);
                    $location.path('/recent');
                }, function() {
                    $location.path('/login');
                });
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
            data: {
                access: ['user', 'admin']
            },
            controller: function($scope, $rootScope, $location, $modal, shareFlash, projects, projectId, AuthFactory) {
                $scope.projects = projects;
                $rootScope.projectId = projectId;

                $scope.login = AuthFactory.getUser();

                $scope.projects.$promise.then(function() {
                    $scope.broadcastProjectList();
                });3

                $scope.broadcastProjectList = function() {
                    $scope.$broadcast('rebuild:scrollbar');
                }

                $scope.createProject = function() {
                    var modalInstance = $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    });

                    modalInstance.result.then(function (model) {
                        $scope.projects.push(model);
                        $scope.broadcastProjectList();
                        shareFlash([]);
                    }, function() {
                        shareFlash([]);
                    });
                }

                $scope.logout = function () {
                    AuthFactory.api().get({},function(response) {
                        AuthFactory.logout();
                        $location.path('/login');
                    })
                }

                $scope.profile = function() {
                    var modalInstance = $modal.open({
                        templateUrl: '/t/user/profile.html',
                        controller: 'ProfileController'
                    });

                    modalInstance.result.then(function () {
                        shareFlash([]);
                    }, function() {
                        shareFlash([]);
                    });
                }
            },
            resolve: {
                projects: function(ProjectsFactory) {
                    return ProjectsFactory.query();
                },
                projectId: function() {
                    return 0;
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
                'head': {
                    templateUrl: '/t/project/pageHeader.html',
                    controller: 'ProjectController',
                    resolve: {
                        projects: function(projects) {
                            return projects;
                        },
                        projectId: function ($stateParams) {
                            return $stateParams.projectId;
                        }
                    }
                },
                'content': {
                    templateUrl: '/t/entry/list.html',
                    controller: 'EntryController',
                    resolve: {
                        entries: function(ProjectKeysFactory, projectId) {
                            return ProjectKeysFactory.keys({id: projectId});
                        },
                        projectId: function ($stateParams) {
                            return $stateParams.projectId;
                        }
                    }
                }
            }
        })
        .state('user.list', {
            url: '/users',
            templateUrl: '/t/user/userList.html',
            controller: 'UserListController',
            resolve: {
                users: function(UsersFactory) {
                    return UsersFactory.query();
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
        .state('user.404', {
            url: '/404',
            templateUrl: '/t/error/404.html'
        });

    $urlRouterProvider.otherwise('/404');

    $httpProvider.interceptors.push('AuthInterceptor');
   // cfpLoadingBarProvider.includeSpinner = false;
}]);
xApp
    .factory('Api', function($resource) {
        var enableCustom = {
            update: {
                method: 'PUT', params: {id: '@id'}
            },
            delete: {
                method: 'DELETE', params: {id: '@id'}
            }
        };

        return {
            project: $resource("/api/project/:id", null, enableCustom),
            user: $resource("/api/user/:id", null, enableCustom),
            authStatus: $resource("/internal/auth/status", null)
        }
    });

/*

.factory('UsersFactory', function ($resource) {
    return $resource("/api/user", {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
})
    .factory('UserFactory', function ($resource) {
        return $resource("/api/user/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('ProfileFactory', function ($resource) {
        return $resource("/api/profile", {}, {
            update: { method: 'POST' }
        })
    });*/

xApp
    .controller('AuthController',function($scope, $location, $sanitize, AuthFactory, shareFlash) {
        $scope.login = function() {
            AuthFactory.api().save({
                'email':    $sanitize($scope.email),
                'password': $sanitize($scope.password)
            }, function(response) {
                AuthFactory.login(response);
                $location.path('/recent');
            }, function(response) {
                shareFlash('danger', response.data.flash);
            })
        }
    })

xApp
    .factory('AuthFactory', function($resource, $cookieStore, $rootScope) {
        var cookieName = 'user';

        var apiEndpoint = function() {
            return $resource("/internal/auth");
        }

        var login = function(response) {
            $cookieStore.put(cookieName, response);
            $rootScope.$broadcast('auth:login', getUser());
        }

        var logout = function() {
            $cookieStore.remove(cookieName);
            $rootScope.$broadcast('auth:login', null);
        }

        var getUser = function() {
            var fromCookie = $cookieStore.get(cookieName) || [];
            return fromCookie.user || [];
        }

        var isLoggedIn = function() {
            var cookie = getUser().id > 0;

            if (cookie) {
                return true;
            }
        }

        return {
            api: apiEndpoint,
            login: login,
            logout: logout,
            getUser: getUser,
            isLoggedIn: isLoggedIn
        }
    });
xApp.factory('AuthInterceptor', function($q, $injector, $location, shareFlash) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            var AuthFactory = $injector.get('AuthFactory');

            if (rejection.status === 420) {
                if (AuthFactory.isLoggedIn()) {
                    shareFlash('warning', 'Session has expired, re-logging in...');
                }
                location.reload();
            }
            if (rejection.status === 401) {
                if (AuthFactory.isLoggedIn()) {
                    shareFlash('warning', 'Session has expired, please log in.');
                }
                AuthFactory.logout();
                $location.path('/login');
            }
            if (rejection.status === 403) {
                shareFlash('danger', 'You cannot access this resource.');
            }
            return $q.reject(rejection);
        }
    };
});
xApp
    .controller('EntryController', function($scope, $rootScope, $state, $modal, shareFlash, entries, projectId, EntryFactory) {

        $scope.entries = entries;
        $rootScope.projectId = projectId;

        $scope.$on('entry:create', function() {
            $scope.createEntry();
        });

        $scope.createEntry = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: 'ModalCreateEntryController',
                resolve: {
                    project_id: function() {
                        return $scope.projectId;
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.entries.push(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.updateEntry = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: 'ModalUpdateEntryController',
                resolve: {
                    entry: function(EntryFactory) {
                        return EntryFactory.show({id: $scope.entries[index].id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.entries[index] = model;
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }


        $scope.deleteEntry = function(index) {
            if (!confirm('Are you sure?')) {
                return;
            }
            EntryFactory.delete({id: $scope.entries[index].id});
            $scope.entries.splice(index, 1);
        }

        $scope.getPassword = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/password.html',
                controller: 'ModalGetPasswordController',
                resolve: {
                    password: function(EntryPasswordFactory) {
                        return EntryPasswordFactory.password({id: $scope.entries[index].id});
                    }
                }
            });
        }
        $scope.entryAccessInfo = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/access.html',
                controller: 'ModalAccessController',
                resolve: {
                    access: function(EntryAccessFactory) {
                        return EntryAccessFactory.query({id: $scope.entries[index].id});
                    }
                }
            });
        }

        $scope.shareEntry = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/share.html',
                controller: 'ModalShareController',
                resolve: {
                    users: function(UsersFactory) {
                        return UsersFactory.query();
                    },
                    access: function(ShareFactory) {
                        return ShareFactory.show({id: $scope.entries[index].id});
                    },
                    entry: function() {
                        return $scope.entries[index];
                    }
                }
            });

            modalInstance.result.then(function (model) {
                shareFlash([]);
            }, function() {
                $state.reload();
                shareFlash([]);
            });
        }
    })
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
    .factory('EntryPasswordFactory', function ($resource) {
        return $resource("/api/entry/password/:id", {}, {
            password: { method: 'GET', params: {id: '@id'} }
        })
    })
    .factory('EntryAccessFactory', function ($resource) {
        return $resource("/api/entry/access/:id", {}, {
            query: { method: 'GET', params: {id: '@id'}, isArray: true }
        })
    })
    .factory('ShareFactory', function ($resource) {
        return $resource("/api/share/:id", {}, {
            show: { method: 'GET', isArray: true  },
            create: { method: 'POST' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('UnsafeFactory', function ($resource) {
        return $resource("/api/unsafe", {}, {
            query: { method: 'GET', isArray: true  }
        })
    })

xApp
    .controller('ModalAccessController', function($scope, $modalInstance, access) {
        $scope.access = access;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('ModalCreateEntryController', function($scope, $modalInstance, EntriesFactory, shareFlash, project_id, GROUPS) {
        $scope.entry = {
            project_id: project_id,
            group_access: {}
        };
        $scope.groups = GROUPS;

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
    .controller('ModalGetPasswordController', function($scope, $modalInstance, password) {
        $scope.password = password;
        $scope.hidden = {
            password: '',
            hash: ''
        };
        $scope.shown = false;

        password.$promise.then(function(promise) {
            var pass = '';
            for (var i=0; i<promise.password.length; i++) {
                pass += '*';
            }
            $scope.hidden.password = pass;
            $scope.hidden.hash = pass;
        }, function() {
            $modalInstance.close();
        });

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.hidden.password = $scope.password.password;
            $scope.shown = true;
        }

        $scope.hide = function() {
            $scope.hidden.password = $scope.hidden.hash;
            $scope.shown = false;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('ModalShareController', function($scope, $modalInstance, users, access, ShareFactory, entry) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;

        $scope.canAccess = function(userId) {
            return $scope.getAccessIndex(userId) != -1;
        }

        $scope.getAccessIndex = function(userId) {
            for (var i=0; i<$scope.access.length; i++) {
                if ($scope.access[i].user_id == userId) {
                    return i;
                }
            }

            return -1;
        }

        $scope.grant = function(userId) {
            ShareFactory.create({
                user_id: userId,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        }

        $scope.revoke = function(userId) {
            var scopeIndex = $scope.getAccessIndex(userId);
            ShareFactory.delete({
                id: $scope.access[scopeIndex].id
            }, function(response) {
                $scope.access.splice(scopeIndex, 1);
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
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
xApp.
    controller('ProfileController', function($scope, $modalInstance, ProfileFactory, shareFlash) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.ok = function () {
            ProfileFactory.update($scope.profile,
                function() {
                    $modalInstance.close();
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
xApp.constant('GROUPS', {
    admin: 'Administrator',
    dev: 'Developer',
    tester: 'Tester',
    pm: 'Project Manager'
});
xApp.
    directive('loader', function() {
        return {
            restrict: 'E',
            scope: {
                when: '='
            },
            template: '<img src="/img/loader.gif" ng-show="when" class="loader">'
        };
    })
    .directive('clipCopy', function () {
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
    });
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
xApp
    .controller('HistoryController', function($scope, history) {
        $scope.history = history;
    })
    .factory('HistoryFactory', function ($resource) {
        return $resource("/api/history", {}, {
            query: { method: 'GET', isArray: true }
        })
    })
xApp
    .controller('ModalCreateProjectController', function($scope, $modalInstance, ProjectsFactory, shareFlash) {
        $scope.project = {};

        $scope.ok = function () {
            ProjectsFactory.create($scope.project,
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
    .controller('ModalProjectOwnerController', function($scope, $modalInstance, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
xApp
    .controller('ModalUpdateProjectController', function($scope, $modalInstance, Api, shareFlash, project) {
        $scope.project = project;

        $scope.ok = function() {
            Api.project.update(
                $scope.project,
                function() {
                    $modalInstance.close($scope.project);
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
    .controller('ProjectController', function($rootScope, $scope, shareFlash, $modal, $location, projects, projectId, ProjectFactory) {

        $scope.projects = projects;
        $scope.projectId = projectId;

        $rootScope.projectId = projectId;

        $scope.getProject = function() {
            return $scope.projects[getProjectIndexById($scope.projectId)];
        }

        var getProjectIndexById = function(projectId) {
            for (var p in $scope.projects) {
                if ($scope.projects[p].id == projectId) {
                    return p;
                }
            }
        }

        $scope.setProject = function(model) {
            return $scope.projects[getProjectIndexById(model.id)] = model;
        }

        $scope.updateProject = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalUpdateProjectController',
                resolve: {
                    project: function(Api) {
                        return Api.project.get({id: $scope.getProject().id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.setProject(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.projectOwnerInfo = function() {
            $modal.open({
                templateUrl: '/t/project/owner.html',
                controller: 'ModalProjectOwnerController',
                resolve: {
                    owner: function(UserFactory) {
                        return UserFactory.show({id: $scope.getProject().user_id});
                    }
                }
            });
        }

        $scope.deleteProject = function() {
            if (!confirm('Are you sure?')) {
                return;
            }
            ProjectFactory.delete({id: $scope.projectId});
            $scope.projects.splice(getProjectIndexById($scope.projectId), 1);
            $rootScope.$broadcast('rebuild:scrollbar');

            $location.path('/recent');
        }

        $scope.createEntry = function() {
            $rootScope.$broadcast('entry:create');
        }
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
xApp
    .controller('HomeController', function($scope, recent) {
        $scope.recent = recent;
    })
    .factory('RecentFactory', function ($resource) {
        return $resource("/api/recent", {}, {
            query: { method: 'GET', isArray: true }
        });
    })
xApp
    .controller('ModalCreateUserController', function($scope, $modalInstance, UsersFactory, shareFlash, GROUPS) {
        $scope.user = {};
        $scope.groups = GROUPS;

        $scope.ok = function () {
            UsersFactory.create($scope.user,
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
    .controller('ModalUpdateUserController', function($scope, $modalInstance, UserFactory, shareFlash, user, GROUPS) {
        $scope.user = user;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            UserFactory.update($scope.user,
                function() {
                    $modalInstance.close($scope.user);
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
    .controller('UserListController', function($scope, $resource, UsersFactory, UserFactory, $modal, users, shareFlash) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalCreateUserController'
            });

            modalInstance.result.then(function (model) {
                $scope.users.push(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.updateUser = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalUpdateUserController',
                resolve: {
                    user: function(UserFactory) {
                        return UserFactory.show({id: $scope.users[index].id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.users[index] = model;
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.deleteUser = function(index) {
            if (!confirm('Are you sure?')) {
                return;
            }
            UserFactory.delete({id: $scope.users[index].id}, function() {
                $scope.users.splice(index, 1);
            });
        }
    })
    .factory('UsersFactory', function ($resource) {
        return $resource("/api/user", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('UserFactory', function ($resource) {
        return $resource("/api/user/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('ProfileFactory', function ($resource) {
        return $resource("/api/profile", {}, {
            update: { method: 'POST' }
        })
    });