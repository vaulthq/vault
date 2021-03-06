(function() {
    angular
        .module('xApp')
        .directive('entryUpdate', entryUpdateDirective);

    function entryUpdateDirective() {
        return {
            restrict: 'A',
            scope: {
                entry: '=entryUpdate',
                on: '='
            },
            link: function($scope, element) {
                if (!$scope.entry.can_edit) {
                    return;
                }

                element.on('click', function(e){
                    $scope.update();
                });
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.update = updateEntry;

                function updateEntry() {
                    $modal.open({
                        templateUrl: 'entry/form.html',
                        controller: 'ModalUpdateEntryController',
                        resolve: {
                            entry: function(Api) {
                                return Api.entry.get({id: $scope.entry.id});
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
