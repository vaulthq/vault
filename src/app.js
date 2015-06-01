var xApp = angular.module('xApp', [
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
    'cfp.hotkeys'
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
            controller: function($scope, $rootScope, $location, $modal, projects, AuthFactory, Api, $filter, $state, hotkeys) {
                $scope.projects = projects;

                $scope.login = AuthFactory.getUser();

                $scope.jump = jump;

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

                $scope.$on('project:update', function(event, project) {
                    $scope.projects[$scope.projects.map(function (i) {return i.id;}).indexOf(project.id)] = project;
                });

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
            url: '/project/:projectId',
            templateUrl: '/t/entry/list.html',
            controller: 'EntryController',
            resolve: {
                project: function ($stateParams, projects) {
                    return projects.$promise.then(function(projects) {
                        for (var i=0; i<projects.length; i++) {
                          if (projects[i].id == $stateParams.projectId) {
                            return projects[i];
                          }
                        }
                    });
                },
                entries: function(Api, $stateParams) {
                    return Api.projectKeys.query({id: $stateParams.projectId});
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
            url: '/projects',
            templateUrl: '/t/project/list.html',
            controller: 'ProjectController'
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
