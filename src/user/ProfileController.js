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

        $scope.clippy = String(localStorage.getItem('clippy')) == 'false';

        $scope.ok = function() {
            Api.profile.save($scope.profile,
                function() {
                    toaster.pop('success', 'Password successfully changed!');
                    $modalInstance.close();
                }
            );
        };

        $scope.toggleClippy = function() {
            localStorage.setItem('clippy', $scope.clippy);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
