xApp
    .controller('ModalOpenAccessController', function($scope, $modalInstance, EntryFactory, flash, entry) {
        $scope.entry = entry;

        $scope.ok = function () {
            EntryFactory.updateGroupAccess($scope.entry,
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