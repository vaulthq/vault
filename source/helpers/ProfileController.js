xApp.
    controller('ProfileController', function($scope, $modalInstance, ProfileFactory, shareFlash) {
        $scope.profile = {
            old: '',
            new: '',
            repeat: ''
        };

        $scope.ok = function () {
            ProfileFactory.update($scope.profile,
                function() {
                    $modalInstance.close();
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