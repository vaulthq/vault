(function() {
    angular
        .module('xApp')
        .directive('keyCreate', dir);

    function dir() {
        return {
            restrict: 'E',
            template: '<a class="btn btn-default btn-xs" title="Add new key" ng-click="create()">Add new key</a>',
            controller: function($rootScope, $scope, Api, toaster) {
                $scope.create = createKey;

                function createKey() {
                    Api.apis.save({}).$promise.then(function(key) {
                        toaster.pop('success', "Key successfully created.");
                        $rootScope.$broadcast('key:create', key);
                    });
                }
            }
        };
    }
})();
