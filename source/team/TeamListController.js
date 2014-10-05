xApp
    .controller('TeamListController', function($scope, $resource, $modal, teams, shareFlash) {
        $scope.teams = teams;

        $scope.createTeam = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/team/create.html',
                controller: 'ModalCreateTeamController'
            });

            modalInstance.result.then(function (model) {
                $scope.teams.push(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }
    });