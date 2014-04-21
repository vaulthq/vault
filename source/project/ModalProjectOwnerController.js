xApp
    .controller('ModalProjectOwnerController', function($scope, $modalInstance, flash, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });