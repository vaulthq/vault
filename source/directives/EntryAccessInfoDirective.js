(function() {
    angular
        .module('xApp')
        .directive('entryAccessInfo', entryAccessInfoDirective);

    function entryAccessInfoDirective() {
        return {
            restrict: 'E',
            template:
                '<a class="btn btn-primary btn-xs" title="Access Information" ng-click="info()" ng-if="!entry.can_edit">' +
                    '<i class="glyphicon glyphicon-info-sign"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.info = entryInfo;

                function entryInfo() {
                    $modal.open({
                        templateUrl: '/t/entry/access.html',
                        controller: 'ModalAccessController',
                        resolve: {
                            access: function(EntryAccessFactory) {
                                return EntryAccessFactory.query({id: $scope.entry.id});
                            }
                        }
                    });
                }
            }
        };
    }
})();
