xApp
    .controller('ModalUpdateUserController', function($scope, $modalInstance, UserFactory, user, GROUPS) {
        $scope.user = user;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            UserFactory.update($scope.user,
                function() {
                    $modalInstance.close($scope.user);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });