(function() {
    angular
        .module('xApp')
        .directive('entryAccessInfo', entryAccessInfoDirective);

    function entryAccessInfoDirective() {
        return {
            restrict: 'A',
            scope: {
                entryAccessInfo: '='
            },
            link: function($scope, $elem) {
                $elem.on('click', $scope.info);
            },
            controller: function($rootScope, $scope, $modal) {
                $scope.info = entryInfo;

                function entryInfo() {
                    $modal.open({
                        templateUrl: '/t/entry/access.html',
                        controller: function($scope, $modalInstance, access, entry) {
                            $scope.access = access;
                            $scope.entry = entry;
                        },
                        resolve: {
                            access: function(Api) {
                                return Api.entryAccess.query({id: $scope.entryAccessInfo.id});
                            },
                            entry: function() {
                                return $scope.entryAccessInfo;
                            }
                        }
                    });
                }
            }
        };
    }
})();
