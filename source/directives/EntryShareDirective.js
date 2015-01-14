(function() {
    angular
        .module('xApp')
        .directive('entryShare', entryShareDirective);

    function entryShareDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="share()" class="btn btn-success btn-xs" title="Share to User">' +
                    '<i class="glyphicon glyphicon-link"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.share = shareEntry;

                function shareEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/share.html',
                        controller: 'ModalShareController',
                        resolve: {
                            users: function(Api) {
                                return Api.user.query();
                            },
                            access: function(Api) {
                                return Api.share.query({id: $scope.entry.id});
                            },
                            entry: function() {
                                return $scope.entry;
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:share', model);
                    });
                }
            }
        };
    }
})();
