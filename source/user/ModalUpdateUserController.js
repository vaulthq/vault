xApp
    .controller('ModalUpdateUserController', function($scope, $modalInstance, UserFactory, shareFlash, user, GROUPS) {
        $scope.user = user;
        $scope.groups = GROUPS;

        $scope.ok = function () {
            UserFactory.update($scope.user,
                function() {
                    $modalInstance.close($scope.user);
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