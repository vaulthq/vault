xApp
    .controller('ModalCreateProjectController', function($scope, $modalInstance, ProjectsFactory, shareFlash) {
        $scope.project = {};

        $scope.ok = function () {
            ProjectsFactory.create($scope.project,
                function(response) {
                    $modalInstance.close(response);
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