xApp
    .controller('ModalGetPasswordController', function($scope, $modalInstance, flash, password) {
        $scope.password = password;
        $scope.hidden = {
            password: '*',
            hash: '*'
        };
        $scope.shown = false;

        password.$promise.then(function(promise) {
            console.log(promise);
            var pass = '';
            for (var i=0; i<promise.password.length; i++) {
                pass += '*';
            }
            $scope.hidden.password = pass;
            $scope.hidden.hash = pass;
        });

        $scope.ok = function () {
            console.log($scope.password);
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.hidden.password = $scope.password.password;
            $scope.shown = true;
        }

        $scope.hide = function() {
            $scope.hidden.password = $scope.hidden.hash;
            $scope.shown = false;
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });