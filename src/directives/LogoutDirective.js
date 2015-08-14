(function() {
    angular
        .module('xApp')
        .directive('logout', logoutDirective);

    function logoutDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="logout()" tooltip-placement="right" tooltip="Log-out ({{login.email}})">' +
                    '<i class="fa fa-sign-out fa-2x"></i>' +
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
