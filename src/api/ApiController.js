(function() {
    angular
        .module('xApp')
        .controller('ApiController', ctrl);

    function ctrl($scope, AuthFactory) {
        $scope.code = AuthFactory.getCode();
        $scope.user = AuthFactory.getUser().email;
    }
})();
