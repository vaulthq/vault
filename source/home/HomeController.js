xApp
    .controller('HomeController',function($scope, projects, $modal, flash, ProjectKeysFactory) {
        $scope.projects = projects;
        $scope.entries = [];

        $scope.activeProject = 0;

        $scope.openProject = function(index) {
            $scope.activeProject = index;

            ProjectKeysFactory.keys({id: $scope.getProject().id}, function(response) {
                $scope.entries = response;
            });
        }

        $scope.getProject = function() {
            return $scope.projects[$scope.activeProject];
        }

        $scope.createEntry = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/entry/form.html',
                controller: function($scope, $modalInstance, EntriesFactory, flash, project_id) {
                    $scope.entry = {
                        project_id: project_id
                    };

                    $scope.ok = function () {
                        EntriesFactory.create($scope.entry,
                            function(response) {
                                $modalInstance.close(response);
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
                    project_id: function() {
                        return $scope.getProject().id;
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.projects.push(model);
                flash([]);
            }, function() {
                flash([]);
            });
        }

        $scope.createProject = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/form.html',
                controller: function($scope, $modalInstance, ProjectsFactory, flash) {
                    $scope.project = {};

                    $scope.ok = function () {
                        ProjectsFactory.create($scope.project,
                            function(response) {
                                $modalInstance.close(response);
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
                $scope.projects.push(model);
                flash([]);
            }, function() {
                flash([]);
            });
        }
    })
