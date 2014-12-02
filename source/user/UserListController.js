xApp
    .controller('UserListController', function($scope, $resource, UsersFactory, UserFactory, $modal, users, shareFlash) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalCreateUserController'
            });

            modalInstance.result.then(function (model) {
                $scope.users.push(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.updateUser = function(userId) {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalUpdateUserController',
                resolve: {
                    user: function(UserFactory) {
                        return UserFactory.show({id: userId});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.users[$scope.users.map(function(e) {return e.id}).indexOf(userId)] = model;
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.deleteUser = function(userId) {
            if (!confirm('Are you sure?')) {
                return;
            }
            UserFactory.delete({id: userId}, function() {
                $scope.users.splice($scope.users.map(function(e) {return e.id}).indexOf(userId), 1);
            });
        }
    })
    .factory('UsersFactory', function ($resource) {
        return $resource("/api/user", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('UserFactory', function ($resource) {
        return $resource("/api/user/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('ProfileFactory', function ($resource) {
        return $resource("/api/profile", {}, {
            update: { method: 'POST' }
        })
    });