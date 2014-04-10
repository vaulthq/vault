xApp.controller('AuthController',function($scope, $location, $sanitize, Authenticate, flash) {
    $scope.login = function() {
        Authenticate.save({
            'email':    $sanitize($scope.email),
            'password': $sanitize($scope.password)
        },function() {
            $location.path('/home');
        },function(response){
            flash(response.data.flash);
        })
    }
})
.controller('HomeController',function($scope,$location,Authenticate, flash){
    $scope.logout = function (){
        Authenticate.get({},function(response) {
            flash(response.data.flash);
            $location.path('/');
        })
    }
})

xApp.factory('Authenticate', function($resource) {
    return $resource("/internal/auth")
})