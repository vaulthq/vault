(function() {
    angular
        .module('xApp')
        .controller('teamMembersController', teamMembersController);

    function teamMembersController($scope, $modalInstance, Api, users, access, team) {
        $scope.users = users;
        $scope.access = access;
        $scope.team = team;

        $scope.canAccess = function(userId) {
            return $scope.getAccessIndex(userId) != -1;
        }

        $scope.getAccessIndex = function(userId) {
            for (var i=0; i<$scope.access.length; i++) {
                if ($scope.access[i].user_id == userId) {
                    return i;
                }
            }

            return -1;
        }

        $scope.grant = function(userId) {
            Api.teamMembers.save({
                user_id: userId,
                id: $scope.team.id
            }, function(response) {
                $scope.access.push(response);
            });
        }

        $scope.revoke = function(userId) {
            var scopeIndex = $scope.getAccessIndex(userId);
            Api.teamMembers.delete({
                id: $scope.access[scopeIndex].id
            }, function() {
                $scope.access.splice(scopeIndex, 1);
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();
