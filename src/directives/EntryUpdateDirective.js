(function() {
    angular
        .module('xApp')
        .directive('entryUpdate', entryUpdateDirective);

    function entryUpdateDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="update()" class="btn btn-warning btn-xs" title="Update">' +
                    '<i class="glyphicon glyphicon-edit"></i> Edit' +
                '</a>',
            scope: {
                entryId: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateEntry;

                function updateEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalUpdateEntryController',
                        resolve: {
                            entry: function(Api) {
                                return Api.entry.get({id: $scope.entryId});
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:update', model);
                    });
                }
            }
        };
    }
})();
