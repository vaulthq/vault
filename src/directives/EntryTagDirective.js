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
                $scope.tag = tagEntry;

                function tagEntry() {
                    $modal.open({
                        templateUrl: '/t/entry/tag.html',
                        controller: 'ModalTagController',
                        resolve: {
                            entry: function() {
                                return $scope.entry;
                            },
                            tags: function(Api) {
                                return Api.entryTags.query();
                            }
                        }
                    }).result.then(function (model) {
                        $rootScope.$broadcast('entry:tag', model);
                    });
                }
            }
        };
    }
})();
