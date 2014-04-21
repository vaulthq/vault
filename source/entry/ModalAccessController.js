xApp
    .controller('ModalAccessController', function($scope, $modalInstance, flash, access) {
        $scope.access = access;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });