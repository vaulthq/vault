(function() {
    angular
        .module('xApp')
        .controller('TeamListController', teamListController);

    function teamListController($scope, $modal, Api, toaster, teams) {
        $scope.teams = teams;

        $scope.create = create;
        $scope.update = update;
        $scope.remove = remove;

        function create() {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'ModalCreateTeamController'
            }).result.then(function (model) {
                $scope.teams.push(model);
            });
        }

        function update(teamId, index) {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'ModalUpdateTeamController',
                resolve: {
                    team: function(Api) {
                        return Api.team.get({id: teamId});
                    }
                }
            }).result.then(function (model) {
                $scope.teams[index] = model;
            });
        }

        function remove(teamId, index) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.team.delete({id: teamId}, function() {
                toaster.pop('info', "Team Deleted", 'Team "' + $scope.teams[index].name + '" has been deleted.');
                $scope.teams.splice(index, 1);
            });
        }
    }
})();
