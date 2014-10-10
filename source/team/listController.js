(function() {
    angular
        .module('xApp')
        .controller('TeamListController', teamListController);

    function teamListController($rootScope, $scope, $modal, $filter, Api, toaster, teams) {
        $scope.teams = teams;

        $scope.create = create;
        $scope.update = update;
        $scope.remove = remove;
        $scope.members = members;

        $rootScope.$on('teamMemberAdded', onTeamMemberAdded);
        $rootScope.$on('teamMemberRemoved', onTeamMemberRemoved);

        function create() {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'createTeamController'
            }).result.then(function (model) {
                $scope.teams.push(model);
            });
        }

        function update(teamId, index) {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'updateTeamController',
                resolve: {
                    team: function(Api) {
                        return Api.team.get({id: teamId});
                    }
                }
            }).result.then(function (model) {
                $scope.teams[index] = model;
            });
        }

        function remove(team) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.team.delete({id: team.id}, function() {
                toaster.pop('info', "Team Deleted", 'Team "' + team.name + '" has been deleted.');
                $scope.teams.splice($scope.teams.indexOf(team), 1);
            });
        }

        function members(teamId, index) {
            $modal.open({
                templateUrl: '/t/team/members.html',
                controller: 'teamMembersController',
                resolve: {
                    users: function(UsersFactory) {
                        return UsersFactory.query();
                    },
                    access: function(Api) {
                        return Api.teamMembers.query({id: teamId});
                    },
                    team: function() {
                        return $scope.teams[index];
                    }
                }
            });
        }

        function onTeamMemberAdded(event, data) {
            $scope.teams[$scope.teams.indexOf(data.team)].users.push(data.member);
        }

        function onTeamMemberRemoved(event, data) {
            var teamIndex = $scope.teams.indexOf(data.team);
            var users = $scope.teams[teamIndex].users;
            users.splice(users.map(function (e) { return e.id; }).indexOf(data.userId), 1);
        }
    }
})();
