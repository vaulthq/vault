(function() {
    angular
        .module('xApp')
        .controller('AuthController', authController);

    function authController($scope, $location, $sanitize, Api, AuthFactory, toaster) {
        $scope.login = login;

        function login() {
            Api.auth.save({
                'email': $sanitize($scope.email),
                'password': $sanitize($scope.password)
            }, function (response) {
                AuthFactory.login(response);
                $location.path('/recent');
            }, function (response) {
                toaster.pop('error', "Login Failed", response.data[0]);
            })
        }
    }
})();
