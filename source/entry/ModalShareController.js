(function() {
    angular
        .module('xApp')
        .controller('ModalShareController', shareController);

    function shareController($scope, $modalInstance, users, access, Api, entry) {
        $scope.users = users;
        $scope.access = access;
        $scope.entry = entry;

        $scope.share = {
            user: 0
        };

        $scope.users.$promise.then(function() {
            $scope.share.user = $scope.users[0].id;
        });

        $scope.shareUser = function() {
            Api.share.save({
                user_id: $scope.share.user,
                id: $scope.entry.id
            }, function(response) {
                $scope.access.push(response);
            });
        }

        $scope.revoke = function(accessId) {
            Api.share.delete({
                id: accessId
            }, function() {
                $scope.access.splice($scope.access.map(function(i) {return i.id;}).indexOf(accessId), 1);
            });
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
