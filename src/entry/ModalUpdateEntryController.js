(function() {
    angular
        .module('xApp')
        .controller('ModalUpdateEntryController', ctrl);

    function ctrl($scope, $modalInstance, Api, entry, GROUPS) {
        $scope.entry = entry;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            Api.entry.update($scope.entry,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.generate = function() {
            if (confirm('Replace password with random one?')) {
                $scope.entry.password = Password.generate(16);
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
