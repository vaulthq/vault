xApp
    .controller('ModalCreateEntryController', function($scope, $modalInstance, EntriesFactory, flash, project_id, GROUPS) {
        $scope.entry = {
            project_id: project_id,
            group_access: {}
        };
        $scope.groups = GROUPS;

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