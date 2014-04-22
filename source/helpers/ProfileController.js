xApp.
    controller('ProfileController', function($scope, $modalInstance, ProfileFactory, flash) {
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
                    flash('danger', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });