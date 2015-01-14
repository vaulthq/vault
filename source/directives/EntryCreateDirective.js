(function() {
    angular
        .module('xApp')
        .directive('entryCreate', entryCreateDirective);

    function entryCreateDirective() {
        return {
            restrict: 'E',
            template: '<a class="btn btn-default btn-xs" title="Add new key" ng-click="create()">Add new key</a>',
            scope: {
                projectId: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.create = createEntry;

                function createEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalCreateEntryController',
                        resolve: {
                            project_id: function() {
                                return $scope.projectId;
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:create', model);
                    });
                }
            }
        };
    }
})();
