(function() {
    angular
        .module('xApp')
        .controller('ModalCreateEntryController', function($scope, $modalInstance, Api, project_id) {
        $scope.entry = {
            project_id: project_id
        };

        $scope.ok = function () {
            Api.entry.save($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.generate = function() {
            $scope.entry.password = Password.generate(16);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

})();

