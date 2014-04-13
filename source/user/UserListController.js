xApp
    .controller('UserListController', function($scope, $resource, UsersFactory, UserFactory, $modal, users, flash) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: function($scope, $modalInstance, UsersFactory, flash) {
                    $scope.user = {};

                    $scope.ok = function () {
                        UsersFactory.create($scope.user,
                            function() {
                                $modalInstance.close($scope.user);
                            },
                            function(err) {
                                flash('danger', err.data);
                            }
                        );
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }
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
                controller: function($scope, $modalInstance, UserFactory, flash, user) {
                    $scope.user = user;

                    $scope.ok = function () {
                        UserFactory.update($scope.user,
                            function() {
                                $modalInstance.close($scope.user);
                            },
                            function(err) {
                                flash('danger', err.data);
                            }
                        );
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
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
            UserFactory.delete({id: $scope.users[index].id});
            $scope.users.splice(index, 1);
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
    });