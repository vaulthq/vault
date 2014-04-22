var xApp = angular.module('xApp', [
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'flash',
    'ui.bootstrap',
    'chieffancypants.loadingBar',
    'angularMoment'
]);

xApp.config(['$routeProvider', '$httpProvider', 'cfpLoadingBarProvider', function($routeProvider, $httpProvider, cfpLoadingBarProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/t/auth/login.html',
            controller: 'AuthController'
        })
        .when('/user/list', {
            templateUrl: '/t/user/userList.html',
            controller: 'UserListController',
            resolve: {
                users: function(UsersFactory) {
                    return UsersFactory.query();
                }
            }
        })
        .when('/home', {
            templateUrl: '/t/home/home.html',
            controller: 'HomeController',
            resolve: {
                projects: function(ProjectsFactory) {
                    return ProjectsFactory.query();
                },
                recent: function(RecentFactory) {
                    return RecentFactory.query();
                }
            }
        })
        .when('/history', {
            templateUrl: '/t/history/list.html',
            controller: 'HistoryController',
            resolve: {
                history: function(HistoryFactory) {
                    return HistoryFactory.query();
                }
            }
        })
        .otherwise({
            redirectTo: '/login'
        });

    $httpProvider.interceptors.push('AuthInterceptor');
    cfpLoadingBarProvider.includeSpinner = false;
}]);