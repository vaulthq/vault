(function() {
    angular
        .module('xApp')
        .controller('ProjectController', controller);

    function controller($scope, $modal, Api, $filter, projects, active, hotkeys, $state) {

        $scope.projects = projects;
        $scope.active = {id: active};

        $scope.create = createProject;
        $scope.getFiltered = getFiltered;
        $scope.teams = teamsAssigned;
        $scope.info = projectOwnerInfo;
        $scope.delete = deleteProject;
        $scope.search = {};
        $scope.$watch("search", onFilterChanged, true);

        function onFilterChanged() {
            var filtered = getFiltered();
            var current = _.findIndex(filtered, function(x) {
                return x.id == $scope.active.id;
            });
            if (current == -1 && filtered.length > 0) {
                $scope.active = filtered[0];
            }
        }

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

        function getFiltered() {
            return $filter('filter')($scope.projects, $scope.search);
        }


        hotkeys.add({
            combo: 'up',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var previous = getFiltered()[current - 1];
                if (previous) {
                    $scope.active = previous;
                }
            }
        });

        hotkeys.add({
            combo: 'down',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var next = getFiltered()[current + 1];
                if (next) {
                    $scope.active = next;
                }
            }
        });


        hotkeys.add({
            combo: 'return',
            description: 'Open project',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                $state.go("user.project", {projectId: $scope.active.id});
            }
        });

        $scope.$on('$destroy', function(){
            hotkeys.del('return');
            hotkeys.del('up');
            hotkeys.del('down');
        });
    }
})();
