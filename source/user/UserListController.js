xApp
    .controller('UserListController', function($scope, $resource, UsersFactory, UserFactory, $modal, users) {
        $scope.users = users;

        $scope.createUser = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/user/create.html',
                controller: function($scope, $modalInstance, items) {
                    $scope.items = items;
                    $scope.selected = {
                        item: $scope.items[0]
                    };

                    $scope.ok = function () {

                        $modalInstance.close($scope.selected.item);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    items: function() {
                        return UsersFactory.query()
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
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