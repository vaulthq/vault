xApp
    .controller('EntryController', function($scope, $state, $modal, shareFlash, entries, projectId, EntryFactory) {

        $scope.entries = entries;
        $scope.projectId = projectId;

        $scope.$on('entry:create', function() {
            $scope.createEntry();
        });

        $scope.createEntry = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: 'ModalCreateEntryController',
                resolve: {
                    project_id: function() {
                        return $scope.projectId;
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.entries.push(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }

        $scope.updateEntry = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: 'ModalUpdateEntryController',
                resolve: {
                    entry: function(EntryFactory) {
                        return EntryFactory.show({id: $scope.entries[index].id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.entries[index] = model;
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        }


        $scope.deleteEntry = function(index) {
            if (!confirm('Are you sure?')) {
                return;
            }
            EntryFactory.delete({id: $scope.entries[index].id});
            $scope.entries.splice(index, 1);
        }

        $scope.getPassword = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/password.html',
                controller: 'ModalGetPasswordController',
                resolve: {
                    password: function(EntryPasswordFactory) {
                        return EntryPasswordFactory.password({id: $scope.entries[index].id});
                    }
                }
            });
        }
        $scope.entryAccessInfo = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/access.html',
                controller: 'ModalAccessController',
                resolve: {
                    access: function(EntryAccessFactory) {
                        return EntryAccessFactory.query({id: $scope.entries[index].id});
                    }
                }
            });
        }

        $scope.shareEntry = function(index) {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/share.html',
                controller: 'ModalShareController',
                resolve: {
                    users: function(UsersFactory) {
                        return UsersFactory.query();
                    },
                    access: function(ShareFactory) {
                        return ShareFactory.show({id: $scope.entries[index].id});
                    },
                    entry: function() {
                        return $scope.entries[index];
                    }
                }
            });

            modalInstance.result.then(function (model) {
                shareFlash([]);
            }, function() {
                $state.reload();
                shareFlash([]);
            });
        }
    })
    .factory('EntriesFactory', function ($resource) {
        return $resource("/api/entry", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('EntryFactory', function ($resource) {
        return $resource("/api/entry/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            password: { method: 'GET', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('EntryPasswordFactory', function ($resource) {
        return $resource("/api/entry/password/:id", {}, {
            password: { method: 'GET', params: {id: '@id'} }
        })
    })
    .factory('EntryAccessFactory', function ($resource) {
        return $resource("/api/entry/access/:id", {}, {
            query: { method: 'GET', params: {id: '@id'}, isArray: true }
        })
    })
    .factory('ShareFactory', function ($resource) {
        return $resource("/api/share/:id", {}, {
            show: { method: 'GET', isArray: true  },
            create: { method: 'POST' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('UnsafeFactory', function ($resource) {
        return $resource("/api/unsafe", {}, {
            query: { method: 'GET', isArray: true  }
        })
    })
