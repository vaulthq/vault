xApp
    .directive('menu', [function() {
        var directive = { restrict: 'EA', replace: true };
        directive.template = '<div ng-include="\'/t/helpers/menu.html\'"></div>';

        directive.controller = ['$scope', '$rootScope', 'AuthFactory', '$location', 'flash', function($scope, $rootScope, AuthFactory, $location, flash) {
            $scope.login = AuthFactory.getUser();
            $rootScope.$on('auth:login', function(_, login) {
                $scope.login = login;
            });

            $scope.logout = function (){
                AuthFactory.api().get({},function(response) {
                    AuthFactory.logout();
                    flash('info', 'You have been logged out!');
                    $location.path('/');
                })
            }
        }];


        return directive;
    }]);