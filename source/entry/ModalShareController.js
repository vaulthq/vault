xApp
    .controller('ModalShareController', function($scope, $modalInstance, flash, users, access, ShareFactory, entry) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;

        $scope.canAccess = function(index) {
            return $scope.getAccessIndex(index) != -1;
        }

        $scope.getAccessIndex = function(index) {
            for (var i=0; i<$scope.access.length; i++) {
                if ($scope.access[i].user_id == $scope.users[index].id) {
                    return i;
                }
            }

            return -1;
        }

        $scope.grant = function(index) {
            ShareFactory.create({
                user_id: $scope.users[index].id,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        }

        $scope.revoke = function(index) {
            var scopeIndex = $scope.getAccessIndex(index);
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