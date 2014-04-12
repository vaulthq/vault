var xApp = angular.module('xApp', ['ngRoute', 'ngSanitize', 'ngResource', 'flash', 'ngCookies', 'ui.bootstrap']);

xApp.config(['$routeProvider', '$httpProvider', '$injector', function($routeProvider, $httpProvider, $injector) {
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
                }
            }
        })
        .otherwise({
            redirectTo: '/login'
        });
    $httpProvider.interceptors.push('AuthInterceptor');
}]);