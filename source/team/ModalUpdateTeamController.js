xApp
    .controller('ModalUpdateTeamController', function($scope, $modalInstance, Api, team, toaster) {
        $scope.team = team;

        $scope.ok = function() {
            Api.team.update(
                $scope.team,
                function() {
                    $modalInstance.close($scope.team);
                },
                function(err) {
                    toaster.pop('warning', "Validation Error", err.data);
                }
            );
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        }
    });