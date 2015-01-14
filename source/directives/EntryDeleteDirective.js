(function() {
    angular
        .module('xApp')
        .directive('entryDelete', entryDeleteDirective);

    function entryDeleteDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="delete()" class="btn btn-danger btn-xs" title="Remove">' +
                    '<i class="glyphicon glyphicon-trash"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, EntryFactory) {
                $scope.delete = entryDelete;

                function entryDelete() {
                    if (!confirm('Are you sure?')) {
                        return;
                    }

                    EntryFactory.delete({id: $scope.entry.id});
                    $rootScope.$broadcast('entry:delete', $scope.entry);
                }
            }
        };
    }
})();
