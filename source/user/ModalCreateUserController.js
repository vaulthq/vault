xApp
    .controller('ModalCreateUserController', function($scope, $modalInstance, UsersFactory, flash) {
        $scope.user = {};

        $scope.ok = function () {
            UsersFactory.create($scope.user,
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