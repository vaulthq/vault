(function() {
    angular
        .module('xApp')
        .directive('projectUpdate', projectUpdateDirective);

    function projectUpdateDirective() {
        return {
            restrict: 'A',
            scope: {
                projectUpdate: '='
            },
            link: function($scope, elem) {
                elem.on('click', function() {
                    $scope.update();
                });
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateProject;

                function updateProject() {
                    $modal.open({
                        templateUrl: 'project/form.html',
                        controller: 'ModalUpdateProjectController',
                        resolve: {
                            project: function(Api) {
                                return Api.project.get({id: $scope.projectUpdate.id});
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
