(function() {
    angular
        .module('xApp')
        .controller('ModalCreateProjectController', ctrl);

    function ctrl($scope, $modalInstance, Api) {
        $scope.project = {};

        $scope.ok = function () {
            Api.project.save($scope.project,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();

