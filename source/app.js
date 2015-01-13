var xApp = angular.module('xApp', [
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'shareFlash',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngScrollbar',
    'angularMoment',
    'toaster'
]);

xApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'uiSelectConfig',
function($stateProvider, $urlRouterProvider, $httpProvider, uiSelectConfig) {

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
            controller: function($scope, $rootScope, $location, $modal, shareFlash, projects, projectId, AuthFactory, Api) {
                $scope.projects = projects;
                $rootScope.projectId = projectId;

                $scope.login = AuthFactory.getUser();

                $scope.projects.$promise.then(function() {
                    $scope.broadcastProjectList();
                });

                $scope.broadcastProjectList = function() {
                    $scope.$broadcast('rebuild:scrollbar');
                }

                $scope.createProject = function() {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    }).result.then(function (model) {
                        $scope.projects.push(model);
                        $scope.broadcastProjectList();
                    });
                }

                $scope.logout = function () {
                    Api.auth.get({}, function() {
                        AuthFactory.logout();
                        $location.path('/login');
                    })
                }

                $scope.profile = function() {
                    $modal.open({
                        templateUrl: '/t/user/profile.html',
                        controller: 'ProfileController'
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

    $httpProvider.interceptors.push('AuthInterceptor');
}]);
