(function() {
    angular
        .module('xApp')
        .controller('ProfileController', ctrl);

    function ctrl($scope, $modalInstance, $location, toaster, Api, AuthFactory) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.ok = function() {
            Api.profile.save($scope.profile,
                function() {
                    toaster.pop('success', 'Password successfully changed!', "Please log in using new password.");
                    $modalInstance.close();
                    AuthFactory.logout();
                    $location.path('/login');
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
