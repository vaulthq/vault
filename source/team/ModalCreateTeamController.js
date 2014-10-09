xApp
    .controller('ModalCreateTeamController', function($scope, $modalInstance, toaster, Api) {
        $scope.team = {};

        $scope.ok = function () {
            Api.team.save($scope.team,
                function(response) {
                    $modalInstance.close(response);
                },
                function(err) {
                    toaster.pop('warning', 'Validation Error', err.data);
                }
            );
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });