xApp
    .controller('HistoryController', function($scope, history) {
        $scope.history = history;
    })
    .factory('HistoryFactory', function ($resource) {
        return $resource("/api/history", {}, {
            query: { method: 'GET', isArray: true }
        })
    });