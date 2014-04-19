xApp
    .controller('HomeController',function($scope, projects, $modal, flash, ProjectKeysFactory) {
        $scope.projects = projects;
        $scope.entries = [];

        $scope.activeProject = -1;

        $scope.loading = {entries: false};



        $scope.openProject = function(index) {
            $scope.activeProject = index;
            $scope.loading.entries = true;

            ProjectKeysFactory.keys({id: $scope.getProject().id}, function(response) {
                $scope.entries = response;
                $scope.loading.entries = false;
            });
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
                console.log($scope.getProject());
                $scope.entries.push(model);
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

    })
