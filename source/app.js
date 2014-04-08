var xApp = angular.module('xApp', ['ngRoute']);

xApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: '/t/login/template.html',
            controller: 'LoginController'
        })
        .when('/test', {
            templateUrl: '/t/login/template.html',
            controller: 'TestController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);


xApp.controller('TestController', ['$scope', function($scope) {
    $scope.test = 'b';
}]);