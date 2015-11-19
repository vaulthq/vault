(function() {
    angular
        .module('xApp')
        .directive('projectShowTeams', directive);

    function directive() {
        return {
            restrict: 'A',
            scope: {
                projectShowTeams: '='
            },
            link: function(scope, element) {
                element.on('click', scope.openModal);
            },
            controller: function($scope, $modal) {
                $scope.openModal = openModal;

                function openModal() {
                    $modal.open({
                        templateUrl: '/t/project-team/assigned.html',
                        controller: 'AssignedTeamController',
                        resolve: {
                            teams: function(Api) {
                                return Api.assignedTeams.query({id: $scope.projectShowTeams.id});
                            }
                        }
                    });
                }
            }
        };
    }
})();
