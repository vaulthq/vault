(function() {
    angular
        .module('xApp')
        .directive('projectTeams', directive);

    function directive() {
        return {
            restrict: 'A',
            scope: {
                projectTeams: '='
            },
            link: function(scope, element) {
                element.on('click', scope.openModal);
            },
            controller: function($scope, $modal) {
                $scope.openModal = openModal;

                function openModal() {
                    $modal.open({
                        templateUrl: '/t/project-team/teams.html',
                        controller: 'ProjectTeamController',
                        resolve: {
                            teams: function (Api) {
                                return Api.team.query();
                            },
                            access: function (Api) {
                                return Api.projectTeams.query({id: $scope.projectTeams.id});
                            },
                            project: function () {
                                return $scope.projectTeams;
                            }
                        }
                    });
                }
            }
        };
    }
})();
