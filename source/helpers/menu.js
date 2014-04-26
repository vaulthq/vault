xApp
    .directive('menu', [function() {
        var directive = { restrict: 'EA', replace: true };
        directive.template = '<div ng-include="\'/t/helpers/menu.html\'"></div>';

        directive.controller = ['$scope', '$rootScope', 'AuthFactory', '$location', 'flash', '$modal', function($scope, $rootScope, AuthFactory, $location, flash, $modal) {
            $scope.login = AuthFactory.getUser();
            $rootScope.$on('auth:login', function(_, login) {
                $scope.login = login;
            });

            $scope.recently = function() {
                $rootScope.$broadcast('clear:project');
            }

            $scope.logout = function () {
                AuthFactory.api().get({},function(response) {
                    AuthFactory.logout();
                    flash('info', 'You have been logged out!');
                    $location.path('/login');
                })
            }

            $scope.profile = function() {
                var modalInstance = $modal.open({
                    templateUrl: '/t/user/profile.html',
                    controller: 'ProfileController'
                });

                modalInstance.result.then(function () {
                    flash([]);
                }, function() {
                    flash([]);
                });
            }
        }];

        return directive;    }]);