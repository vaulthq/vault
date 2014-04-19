xApp
    .controller('ModalCreateEntryController', function($scope, $modalInstance, EntriesFactory, flash, project_id) {
        $scope.entry = {
            project_id: project_id
        };

        $scope.ok = function () {
            EntriesFactory.create($scope.entry,
                function(response) {
                    $modalInstance.close(response);
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