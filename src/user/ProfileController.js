(function() {
    angular
        .module('xApp')
        .controller('ProfileController', ctrl);

    function ctrl($scope, $modalInstance, toaster, Api) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.ok = function() {
            Api.profile.save($scope.profile,
                function() {
                    toaster.pop('success', 'Password successfully changed!');
                    $modalInstance.close();
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
