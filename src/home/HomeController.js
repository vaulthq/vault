(function() {
    angular
        .module('xApp')
        .controller('HomeController', function($scope, recent) {
            $scope.recent = recent;
        })
        .factory('RecentFactory', function ($resource) {
            return $resource("/api/recent", {}, {
                query: { method: 'GET', isArray: true }
            });
        });
})();
