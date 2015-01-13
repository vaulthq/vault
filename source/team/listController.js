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
        };

        function update(teamId) {
            $modal.open({
                templateUrl: '/t/team/form.html',
                controller: 'updateTeamController',
                resolve: {
                    team: function(Api) {
                        return Api.team.get({id: teamId});
                    }
                }
            }).result.then(function (model) {
                $scope.teams[$scope.teams.map(function(e) {return e.id}).indexOf(teamId)] = model;
            });
        };

        function remove(teamId) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.team.delete({id: teamId}, function() {
                var teamIndex = $scope.teams.map(function(e) {return e.id}).indexOf(teamId);
                toaster.pop('info', "Team Deleted", 'Team "' + $scope.teams[teamIndex].name + '" has been deleted.');
                $scope.teams.splice(teamIndex, 1);
            });
        };

        function members(teamId) {
            $modal.open({
                templateUrl: '/t/team/members.html',
                controller: 'teamMembersController',
                resolve: {
                    users: function(Api) {
                        return Api.user.query();
                    },
                    access: function(Api) {
                        return Api.teamMembers.query({id: teamId});
                    },
                    team: function() {
                        return $scope.teams[$scope.teams.map(function(c) {return c.id}).indexOf(teamId)];
                    }
                }
            });
        };

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
