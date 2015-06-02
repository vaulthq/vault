(function() {
    angular
        .module('xApp')
        .directive('projectUpdate', projectUpdateDirective);

    function projectUpdateDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-warning btn-xs" title="Edit project" ng-click="update()" ng-if="project.can_edit">' +
                    '<i class="glyphicon glyphicon-edit"></i>' +
                '</a>',
            scope: {
                project: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateProject;

                function updateProject() {
                    $modal.open({
                        templateUrl: '/t/project/form.html',
                        controller: 'ModalUpdateProjectController',
                        resolve: {
                            project: function(Api) {
                                return Api.project.get({id: $scope.project.id});
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('project:update', model);
                    });
                }
            }
        };
    }
})();
