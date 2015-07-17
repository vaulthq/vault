xApp
    .controller('ModalUpdateEntryController', function($scope, $modalInstance, EntryFactory, entry, GROUPS) {
        $scope.entry = entry;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            EntryFactory.update($scope.entry,
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
