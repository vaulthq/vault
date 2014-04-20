xApp
    .controller('HomeController',function($scope, projects, $modal, flash, ProjectKeysFactory, EntryFactory, ProjectFactory, EntryPasswordFactory) {
        $scope.projects = projects;
        $scope.entries = [];

        $scope.activeProject = -1;

        $scope.loading = {entries: false};

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

            modalInstance.result.then(function (model) {
                flash([]);
            }, function() {
                flash([]);
            });
        }
    })
