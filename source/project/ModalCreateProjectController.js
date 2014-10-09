xApp
    .controller('ModalCreateProjectController', function($scope, $modalInstance, ProjectsFactory, toaster) {
        $scope.project = {};

        $scope.ok = function () {
            ProjectsFactory.create($scope.project,
                function(response) {
                    $modalInstance.close(response);
                },
                function(err) {
                    toaster.pop('warning', 'Validation Error', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });