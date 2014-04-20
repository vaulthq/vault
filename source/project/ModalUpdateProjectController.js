xApp
    .controller('ModalUpdateProjectController', function($scope, $modalInstance, ProjectFactory, flash, project) {
        $scope.project = project;

        $scope.ok = function () {
            ProjectFactory.update($scope.project,
                function() {
                    $modalInstance.close($scope.project);
                },
                function(err) {
                    flash('danger', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });