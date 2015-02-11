xApp
    .controller('ProjectController', function($rootScope, $scope, shareFlash, $modal, $location, projects, projectId, ProjectFactory) {

        $scope.projects = projects;
        $scope.projectId = projectId;

        $rootScope.projectId = projectId;

        $scope.projectTeams = teams;
        $scope.assignedTeams = teamsAssigned;

        $scope.getProject = function() {
            return $scope.projects[getProjectIndexById($scope.projectId)];
        };

        var getProjectIndexById = function(projectId) {
            for (var p in $scope.projects) {
                if ($scope.projects[p].id == projectId) {
                    return p;
                }
            }
        };

        $scope.setProject = function(model) {
            return $scope.projects[getProjectIndexById(model.id)] = model;
        };

        $scope.updateProject = function() {
            var modalInstance = $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalUpdateProjectController',
                resolve: {
                    project: function(Api) {
                        return Api.project.get({id: $scope.getProject().id});
                    }
                }
            });

            modalInstance.result.then(function (model) {
                $scope.setProject(model);
                shareFlash([]);
            }, function() {
                shareFlash([]);
            });
        };

        function teams() {
            $modal.open({
                templateUrl: '/t/project-team/teams.html',
                controller: 'ProjectTeamController',
                resolve: {
                    teams: function(Api) {
                        return Api.team.query();
                    },
                    access: function(Api) {
                        return Api.projectTeams.query({id: $scope.getProject().id});
                    },
                    project: function() {
                        return $scope.getProject();
                    }
                }
            });
        }

        function teamsAssigned() {
            $modal.open({
                templateUrl: '/t/project-team/assigned.html',
                controller: 'AssignedTeamController',
                resolve: {
                    teams: function(Api) {
                        return Api.assignedTeams.query({id: $scope.getProject().id});
                    }
                }
            });
        }

        $scope.projectOwnerInfo = function() {
            $modal.open({
                templateUrl: '/t/project/owner.html',
                controller: 'ModalProjectOwnerController',
                resolve: {
                    owner: function(Api) {
                        return Api.user.get({id: $scope.getProject().user_id});
                    }
                }
            });
        };

        $scope.deleteProject = function() {
            if (!confirm('Are you sure?')) {
                return;
            }
            ProjectFactory.delete({id: $scope.projectId});
            $scope.projects.splice(getProjectIndexById($scope.projectId), 1);
            $location.path('/recent');
        };
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
