(function() {
    angular
        .module('xApp')
        .controller('ProjectTeamController', teamController);

    function teamController($scope, Api, teams, project, access) {
        $scope.teams = teams;
        $scope.access = access;
        $scope.project = project;

        $scope.canAccess = function(team) {
            return getAccessIndexForUserId(team.id) != -1;
        };

        $scope.grant = function(team) {
            Api.projectTeams.save({
                team_id: team.id,
                project_id: $scope.project.id
            }, function (response) {
                $scope.access.push(response);
            });
        };

        $scope.revoke = function(team) {
            var accessIndex = getAccessIndexForUserId(team.id);

            Api.projectTeams.delete({
                id: $scope.access[accessIndex].id
            }, function() {
                $scope.access.splice(accessIndex, 1);
            });
        };

        function getAccessIndexForUserId(teamId) {
            return $scope.access.map(function (e) { return e.team_id; }).indexOf(teamId);
        }
    }
})();
