xApp
    .controller('HomeController', function($scope, $modal, flash, ProjectKeysFactory, EntryFactory, ProjectFactory, AuthFactory, projects, recent, RecentFactory, unsafe, UnsafeFactory) {
        $scope.projects = projects;
        $scope.entries = [];
        $scope.recent = recent;
        $scope.unsafe = unsafe;

        $scope.activeProject = -1;

        $scope.loading = {entries: false};

        $scope.$on('clear:project', function() {
            $scope.openProject(-1);
            $scope.recent = RecentFactory.query();
        });

        $scope.isUnsafe = function(id) {
            for (var i=0; i< $scope.unsafe.length; i++) {
                if ($scope.unsafe[i].id == id) {
                    return true;
                }
            }

            return false;
        }

        $scope.openProject = function(index) {
            $scope.activeProject = index;

            if (index >= 0) {
                $scope.loading.entries = true;
                ProjectKeysFactory.keys({id: $scope.getProject().id}, function(response) {
                    $scope.entries = response;
                    $scope.loading.entries = false;
                });
            } else {
                $scope.entries = [];
            }
        }

        $scope.openProjectById = function(id) {
            for (var i=0; i<projects.length; i++) {
                if (projects[i].id == id) {
                    $scope.openProject(i);
                    return;
                }
            }
            flash('danger', 'Project was removed.');
        }

        $scope.getProject = function() {
            return $scope.projects[$scope.activeProject];
        }

        $scope.createEntry = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: 'ModalCreateEntryController',
                resolve: {
                    project_id: function() {
                        return $scope.getProject().id;
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

                if ($scope.unsafe.length > 0) {
                    $scope.unsafe = UnsafeFactory.query();
                }

                flash([]);
            }, function() {
                flash([]);
            });
        }

        $scope.createProject = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalCreateProjectController'
            });

            modalInstance.result.then(function (model) {
                $scope.projects.push(model);
                flash([]);
            }, function() {
                flash([]);
            });
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
                $scope.projects[$scope.activeProject] = model;
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
    .factory('RecentFactory', function ($resource) {
        return $resource("/api/recent", {}, {
            query: { method: 'GET', isArray: true }
        });
    })