(function() {
    angular
        .module('xApp')
        .directive('profile', profileDirective);

    function profileDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="profile()" title="Change Account Password">' +
                    '<span class="glyphicon glyphicon-wrench"></span><br>Profile' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.profile = profile;

                function profile() {
                    $modal.open({
                        templateUrl: '/t/user/profile.html',
                        controller: 'ProfileController'
                    });
                }
            }
        };
    }
})();
