xApp
    .controller('ModalCreateTeamController', function($scope, $modalInstance, shareFlash, Api) {
        $scope.team = {};

        $scope.ok = function () {
            Api.team.save($scope.team,
                function(response) {
                    $modalInstance.close(response);
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