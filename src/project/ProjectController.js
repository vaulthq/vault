(function() {
    angular
        .module('xApp')
        .controller('ProjectController', controller);

    function controller($scope, $modal, Api, projects, active) {

        $scope.projects = projects;
        $scope.activeId = active;

        $scope.create = createProject;
        $scope.teams = teamsAssigned;
        $scope.info = projectOwnerInfo;
        $scope.delete = deleteProject;

        function createProject() {
            $modal.open({
                templateUrl: '/t/project/form.html',
                controller: 'ModalCreateProjectController'
            }).result.then(function (model) {
                $scope.projects.push(model);
            });
        }

        function teamsAssigned(project) {
            $modal.open({
                templateUrl: '/t/project-team/assigned.html',
                controller: 'AssignedTeamController',
                resolve: {
                    teams: function(Api) {
                        return Api.assignedTeams.query({id: project.id});
                    }
                }
            });
        }

        function projectOwnerInfo(project) {
            $modal.open({
                templateUrl: '/t/project/owner.html',
                controller: 'ModalProjectOwnerController',
                resolve: {
                    owner: function(Api) {
                        return Api.user.get({id: project.user_id});
                    }
                }
            });
        }

        function deleteProject(project) {
            if (!confirm('Are you sure?')) {
                return;
            }

            Api.project.delete({id: project.id});
            $scope.projects.splice($scope.projects.map(function (i) {return i.id;}).indexOf(project.id), 1);
        }

    }
})();
