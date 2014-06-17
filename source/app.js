var xApp = angular.module('xApp', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'flash',
    'ui.bootstrap',
    'ui.router',
    'chieffancypants.loadingBar',
    'angularMoment'
]);

xApp.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    'cfpLoadingBarProvider',
function($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {

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
                if (AuthFactory.getUser().id > 0) {
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
            controller: function($scope, flash, $modal, projects) {
                $scope.projects = projects;

                $scope.createProject = function() {
                    var modalInstance = $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalCreateProjectController'
                    });

                    modalInstance.result.then(function (model) {
                        $scope.projects.push(model);
                        flash([]);
                    }, function() {
                        flash([]);
                    });
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
            templateUrl: '/t/project/entriesList.html',
            controller: 'ProjectController',
            resolve: {
                projectId: function($stateParams) {
                    return $stateParams.projectId;
                },
                entries: function(ProjectKeysFactory, $stateParams) {
                    return ProjectKeysFactory.keys({id: $stateParams.projectId});
                },
                unsafe: function(UnsafeFactory) {
                    return UnsafeFactory.query();
                }
            }
        });

    $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: ['admin']
            }
        })
        .state('admin.users', {
            url: '/users',
            templateUrl: '/t/user/userList.html',
            controller: 'UserListController',
            resolve: {
                users: function(UsersFactory) {
                    return UsersFactory.query();
                }
            }
        })
        .state('admin.history', {
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
    cfpLoadingBarProvider.includeSpinner = false;
}]);