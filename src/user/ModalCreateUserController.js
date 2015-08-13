(function() {
    angular
        .module('xApp')
        .controller('ModalCreateUserController', ctrl);

    function ctrl($scope, $modalInstance, Api, GROUPS) {
        $scope.user = {};
        $scope.groups = GROUPS;

        $scope.ok = function () {
            Api.user.save($scope.user,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();

