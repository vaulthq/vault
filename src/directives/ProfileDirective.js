(function() {
    angular
        .module('xApp')
        .directive('profile', profileDirective);

    function profileDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-side-menu" ng-click="profile()" tooltip-placement="right" tooltip="Edit Profile">' +
                    '<i class="fa fa-wrench fa-2x"></i>' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.profile = profile;

                function profile() {
                    $modal.open({
                        templateUrl: 'user/profile.html',
                        controller: 'ProfileController'
                    });
                }
            }
        };
    }
})();
