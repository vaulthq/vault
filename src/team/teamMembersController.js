(function() {
    angular
        .module('xApp')
        .controller('teamMembersController', controller);

    function controller($rootScope, $scope, Api, users, access, team) {
        $scope.users = users;
        $scope.access = access;
        $scope.team = team;

        $scope.users.$promise.then(removeOwnerFromList);

        $scope.canAccess = function(user) {
            return getAccessIndexForUserId(user.id) != -1;
        };

        $scope.grant = function(user) {
            Api.teamMembers.save({
                user_id: user.id,
                id: $scope.team.id
            }, function(response) {
                $scope.access.push(response);
                $rootScope.$broadcast('teamMemberAdded', {member: user, team: $scope.team});
            });
        };

        $scope.revoke = function(user) {
            var accessIndex = getAccessIndexForUserId(user.id);

            Api.teamMembers.delete({
                id: $scope.access[accessIndex].id
            }, function () {
                $scope.access.splice(accessIndex, 1);
                $rootScope.$broadcast('teamMemberRemoved', {userId: user.id, team: $scope.team});
            });
        };

        function getAccessIndexForUserId(userId) {
            return $scope.access.map(function (e) { return e.user_id; }).indexOf(userId);
        }

        function removeOwnerFromList() {
            $scope.users.splice(
                $scope.users.map(function (e) { return e.id; }).indexOf($scope.team.user_id),
                1
            );
        }
    }
})();
