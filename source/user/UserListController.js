xApp
    .controller('UserListController', function($scope, $resource, UsersFactory, UserFactory, $modal, users, flash) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalCreateUserController'
            });

            modalInstance.result.then(function (model) {
                $scope.users.push(model);
                flash([]);
            }, function() {
                flash([]);
            });
        }

        $scope.updateUser = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: 'ModalUpdateUserController',
                resolve: {
                    user: function(UserFactory) {
                        return UserFactory.show({id: $scope.users[index].id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.users[index] = model;
                flash([]);
            }, function() {
                flash([]);
            });
        }

        $scope.deleteUser = function(index) {
            if (!confirm('Are you sure?')) {
                return;
            }
            UserFactory.delete({id: $scope.users[index].id}, function() {
                $scope.users.splice(index, 1);
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