xApp
    .controller('ModalProjectOwnerController', function($scope, $modalInstance, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });