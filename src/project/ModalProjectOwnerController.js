(function() {
    angular
        .module('xApp')
        .controller('ModalProjectOwnerController', ctrl);

    function ctrl($scope, $modalInstance, owner) {
        $scope.owner = owner;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
