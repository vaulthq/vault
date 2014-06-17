xApp
    .controller('AuthController',function($scope, $location, $sanitize, AuthFactory, flash) {
        $scope.login = function() {
            AuthFactory.api().save({
                'email':    $sanitize($scope.email),
                'password': $sanitize($scope.password)
            }, function(response) {
                AuthFactory.login(response);
                $location.path('/recent');
            }, function(response) {
                flash('danger', response.data.flash);
            })
        }
    })
