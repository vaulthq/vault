(function() {
    angular
        .module('xApp')
        .controller('UserListController', controller);

    function controller($scope, $modal, Api, users) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalCreateUserController'
            });

            modalInstance.result.then(function (model) {
                $scope.users.push(model);
            });
        };

        $scope.updateUser = function(userId) {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalUpdateUserController',
                resolve: {
                    user: function(Api) {
                        return Api.user.get({id: userId});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.users[$scope.users.map(function(e) {return e.id}).indexOf(userId)] = model;
            });
        };

        $scope.deleteUser = function(userId) {
            if (!confirm('Are you sure?')) {
                return;
            }
            Api.user.delete({id: userId}, function() {
                $scope.users.splice($scope.users.map(function(e) {return e.id}).indexOf(userId), 1);
            });
        };
    }
})();
