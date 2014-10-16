xApp
    .controller('ModalCreateUserController', function($scope, $modalInstance, UsersFactory, GROUPS) {
        $scope.user = {};
        $scope.groups = GROUPS;

        $scope.ok = function () {
            UsersFactory.create($scope.user,
                function(response) {
                    $modalInstance.close(response);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });