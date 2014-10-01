xApp
    .controller('ModalShareController', function($scope, $modalInstance, users, access, ShareFactory, entry) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;

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
            ShareFactory.create({
                user_id: userId,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        }

        $scope.revoke = function(userId) {
            var scopeIndex = $scope.getAccessIndex(userId);
            ShareFactory.delete({
                id: $scope.access[scopeIndex].id
            }, function(response) {
                $scope.access.splice(scopeIndex, 1);
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });