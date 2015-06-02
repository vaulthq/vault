(function() {
    angular
        .module('xApp')
        .directive('logout', logoutDirective);

    function logoutDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="logout()" title="Log Out ({{login.email}})">' +
                    '<span class="glyphicon glyphicon-off"></span><br>Logout' +
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
