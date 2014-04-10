var xApp = angular.module('xApp', ['ngRoute', 'ngSanitize', 'ngResource', 'flash']);

xApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/t/auth/login.html',
            controller: 'AuthController'
        })
        .when('/home', {
            templateUrl: '/t/auth/home.html',
            controller: 'HomeController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);