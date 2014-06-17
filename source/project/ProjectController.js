xApp
    .controller('ProjectController', function($scope, flash, $modal, projects, projectId, entries, ProjectFactory) {

        $scope.projects = projects;
        $scope.projectId = projectId;
        $scope.entries = entries;
        $scope.unsafe = [];

        $scope.getProject = function() {
            for (var p in $scope.projects) {
                if ($scope.projects[p].id == $scope.projectId) {
                    return $scope.projects[p];
                }
            }
            return [];
        }

        $scope.setProject = function(model) {
            for (var p in $scope.projects) {
                if ($scope.projects[p].id == model.id) {
                    return $scope.projects[p] = model;
                }
            }
        }

        $scope.updateProject = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalUpdateProjectController',
                resolve: {
                    project: function(ProjectFactory) {
                        return ProjectFactory.show({id: $scope.getProject().id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.setProject(model);
                flash([]);
            }, function() {
                flash([]);
            });
        }

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
                flash([]);
            }, function() {
                flash([]);
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
                flash([]);
            }, function() {
                flash([]);
            });
        }


        $scope.projectOwnerInfo = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/owner.html',
                controller: 'ModalProjectOwnerController',
                resolve: {
                    owner: function(UserFactory) {
                        return UserFactory.show({id: $scope.getProject().user_id});
                    }
                }
            });
        }

        $scope.deleteProject = function() {
            if (!confirm('Are you sure?')) {
                return;
            }
            ProjectFactory.delete({id: $scope.getProject().id});
            $scope.projects.splice($scope.activeProject, 1);

            $scope.openProject($scope.projects[0] ? 0 : -1);
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
                flash([]);
            }, function() {
                $scope.openProject($scope.activeProject);
                flash([]);
            });
        }
    })
    .factory('ProjectsFactory', function ($resource) {
        return $resource("/api/project", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('ProjectFactory', function ($resource) {
        return $resource("/api/project/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} },
            keys: { method: 'GET', params: {id: '@id'} }
        })
    })
    .factory('ProjectKeysFactory', function ($resource) {
        return $resource("/api/project/keys/:id", {}, {
            keys: { method: 'GET', params: {id: '@id'}, isArray: true  }
        })
    });