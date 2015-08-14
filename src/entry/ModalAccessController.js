(function() {
    angular
        .module('xApp')
        .controller('ModalAccessController', function($scope, $modalInstance, access) {
        $scope.access = access;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
})();
