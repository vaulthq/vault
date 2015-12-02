(function() {
    angular
        .module('xApp')
        .directive('projectInfo', directive);

    function directive() {
        return {
            restrict: 'A',
            scope: {
                projectInfo: '='
            },
            link: function(scope, element) {
                element.on('click', scope.openModal);
            },
            controller: function($scope, $modal) {
                $scope.openModal = openModal;

                function openModal() {
                    $modal.open({
                        templateUrl: '/t/project-team/assigned.html',
                        controller: function($scope, teams, project, owner) {
                            $scope.teams = teams;
                            $scope.project = project;
                            $scope.owner = owner;
                        },
                        resolve: {
                            teams: function(Api) {
                                return Api.assignedTeams.query({id: $scope.projectInfo.id});
                            },
                            project: function() {
                                return $scope.projectInfo;
                            },
                            owner: function(Api) {
                                return Api.user.get({id: $scope.projectInfo.user_id});
                            }
                        }
                    });
                }
            }
        };
    }
})();
