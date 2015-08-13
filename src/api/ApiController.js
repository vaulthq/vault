(function() {
    angular
        .module('xApp')
        .controller('ApiController', ctrl);

    function ctrl($scope, Api, apis) {
        $scope.apis = apis;
        $scope.revoke = revoke;

        $scope.$on('key:create', onKeyCreate);

        function revoke(api) {
            if (!confirm('Are you sure?')) {
                return;
            }

            Api.apis.remove({id: api.id});
            $scope.apis.splice($scope.apis.map(function(x) { return x.id; }).indexOf(api.id), 1);
        }

        function onKeyCreate(e, key) {
            $scope.apis.push(key);
        }
    }
})();
