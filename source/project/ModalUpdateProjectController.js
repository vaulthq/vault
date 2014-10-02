xApp
    .controller('ModalUpdateProjectController', function($scope, $modalInstance, Api, shareFlash, project) {
        $scope.project = project;

        $scope.ok = function() {
            Api.project.update(
                $scope.project,
                function() {
                    $modalInstance.close($scope.project);
                },
                function(err) {
                    shareFlash('danger', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });