(function() {
    angular
        .module('xApp')
        .controller('HomeController', function($scope, recent, hotkeys, $rootScope) {
            $scope.recent = recent;
            $scope.active = null;
            $scope.$on('$destroy', onDestroy);
            recent.$promise.then(function(){
                if (recent.length > 0) {
                    $scope.active = recent[0];
                }
            });

            hotkeys.add({
                combo: 'return',
                description: 'Download and copy password',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    $rootScope.$broadcast("PasswordRequest", $scope.active);
                }
            });


            hotkeys.add({
                combo: 'up',
                description: 'Navigate up',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex(recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var previous = recent[current - 1];
                    if (previous) {
                        $scope.active = previous;
                    }
                }
            });

            hotkeys.add({
                combo: 'down',
                description: 'Navigate down',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex(recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var next = recent[current + 1];
                    if (next) {
                        $scope.active = next;
                    }
                }
            });

            function onDestroy() {
                hotkeys.del('return');
                hotkeys.del('up');
                hotkeys.del('down');
            }

        })
        .factory('RecentFactory', function ($resource) {
            return $resource("/api/recent", {}, {
                query: { method: 'GET', isArray: true }
            });
        });
})();
