(function() {
    angular
        .module('xApp')
        .directive('entryTag', entryTagDirective);

    function entryTagDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="tag()" class="btn btn-default btn-xs" title="Manage Tags">' +
                    '<i class="glyphicon glyphicon-tag"></i> Tag' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($rootScope, $scope, $modal) {
                //$scope.share = shareEntry;
                //
                //function shareEntry() {
                //    $modal.open({
                //        templateUrl: '/t/entry/share.html',
                //        controller: 'ModalShareController',
                //        resolve: {
                //            users: function(Api) {
                //                return Api.user.query();
                //            },
                //            access: function(Api) {
                //                return Api.share.query({id: $scope.entry.id});
                //            },
                //            entry: function() {
                //                return $scope.entry;
                //            },
                //            teams: function(Api) {
                //                return Api.team.query();
                //            },
                //            entryTeams: function(Api) {
                //                return Api.entryTeams.query({id: $scope.entry.id});
                //            }
                //        }
                //    }).result.then(function (model) {
                //        $rootScope.$broadcast('entry:share', model);
                //    });
                //}
            }
        };
    }
})();
