(function() {
    angular
        .module('xApp')
        .controller('ModalShareController', shareController);

    function shareController($scope, $modalInstance, Api, users, access, entry, teams, entryTeams) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;
        $scope.teams = teams;
        $scope.entryTeams = entryTeams;

        $scope.share = {
            user: 0,
            team: 0
        };

        $scope.users.$promise.then(function() {
            $scope.share.user = $scope.users[0] ? $scope.users[0].id : 0;
        });

        $scope.teams.$promise.then(function() {
            $scope.share.team = $scope.teams[0] ? $scope.teams[0].id : 0;
        });

        $scope.shareUser = function() {
            Api.share.save({
                user_id: $scope.share.user,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        };

        $scope.shareTeam = function() {
            Api.entryTeams.save({
                team_id: $scope.share.team,
                id: $scope.entry.id
            }, function(response) {
                $scope.entryTeams.push(response);
            });
        };

        $scope.revokeUser = function(accessId) {
            Api.share.delete({
                id: accessId
            }, function() {
                $scope.access.splice($scope.access.map(function(i) {return i.id;}).indexOf(accessId), 1);
            });
        };

        $scope.revokeTeam = function(accessId) {
            Api.entryTeams.delete({
                id: accessId
            }, function() {
                $scope.entryTeams.splice($scope.entryTeams.map(function(i) {return i.id;}).indexOf(accessId), 1);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
