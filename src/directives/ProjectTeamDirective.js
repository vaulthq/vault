(function() {
    angular
        .module('xApp')
        .directive('projectTeam', directive);

    function directive() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-success btn-xs" title="Assign Team" ng-click="teams()" ng-if="project.can_edit">' +
                    '<i class="glyphicon glyphicon-link"></i>' +
                '</a>',
            scope: {
                project: '='
            },
            controller: function($scope, $modal) {
                $scope.teams = teams;

                function teams() {
                  $modal.open({
                      templateUrl: '/t/project-team/teams.html',
                      controller: 'ProjectTeamController',
                      resolve: {
                          teams: function(Api) {
                              return Api.team.query();
                          },
                          access: function(Api) {
                              return Api.projectTeams.query({id: $scope.project.id});
                          },
                          project: function() {
                              return $scope.project;
                          }
                      }
                  });
                }
            }
        };
    }
})();
