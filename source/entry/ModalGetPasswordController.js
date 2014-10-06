xApp
    .controller('ModalGetPasswordController', function($scope, $modalInstance, password) {
        $scope.password = password;

        $scope.shown = false;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.shown = true;
        }

        $scope.hide = function() {
            $scope.shown = false;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });