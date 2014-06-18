xApp
    .controller('AuthController',function($scope, $location, $sanitize, AuthFactory, shareFlash) {
        $scope.login = function() {
            AuthFactory.api().save({
                'email':    $sanitize($scope.email),
                'password': $sanitize($scope.password)
            }, function(response) {
                AuthFactory.login(response);
                $location.path('/recent');
            }, function(response) {
                shareFlash('danger', response.data.flash);
            })
        }
    })
