(function() {
    angular
        .module('xApp')
        .directive('entryDelete', entryDeleteDirective);

    function entryDeleteDirective() {
        return {
            restrict: 'A',
            scope: {
                entry: '=entryDelete'
            },
            link: function($scope, element) {
                element.on('click', function(e){
                    $scope.delete();
                });
            },
            controller: function($rootScope, $scope, Api) {
                $scope.delete = entryDelete;

                function entryDelete() {
                    if (!confirm('Are you sure?')) {
                        return;
                    }

                    Api.entry.delete({id: $scope.entry.id});
                    $rootScope.$broadcast('entry:delete', $scope.entry);
                }
            }
        };
    }
})();
