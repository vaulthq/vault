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
            data: {
                access: ['user', 'admin']
            },
            controller: function($scope, $rootScope, $location, $modal, shareFlash, projects, projectId, AuthFactory) {
                $scope.projects = projects;
                $rootScope.projectId = projectId;

                $scope.login = AuthFactory.getUser();

                $scope.createProject = function() {
                    var modalInstance = $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    });

                    modalInstance.result.then(function (model) {
                        $scope.projects.push(model);
                        shareFlash([]);
                    }, function() {
                        shareFlash([]);
                    });
                }

                $scope.logout = function () {
                    AuthFactory.api().get({},function(response) {
                        AuthFactory.logout();
                        shareFlash('info', 'You have been logged out!');
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
        });

    $urlRouterProvider.otherwise('/404');

    $httpProvider.interceptors.push('AuthInterceptor');
   // cfpLoadingBarProvider.includeSpinner = false;
}]);