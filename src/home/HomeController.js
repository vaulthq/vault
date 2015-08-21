(function() {
    angular
        .module('xApp')
        .controller('HomeController', function($scope, recent, hotkeys, $rootScope) {
            $scope.recent = recent;
            $scope.active = {};
            $scope.setActive = setActive;
            $scope.$on('$destroy', onDestroy);

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
                description: 'Show project jump window',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex($scope.recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var previous = $scope.recent[current - 1];
                    if (previous) {
                        $scope.active = previous;
                    }
                }
            });

            hotkeys.add({
                combo: 'down',
                description: 'Show project jump window',
                allowIn: ['input', 'select', 'textarea'],
                callback: function(event, hotkey) {
                    event.preventDefault();
                    var current = _.findIndex($scope.recent, function(x) {
                        return x.id == $scope.active.id;
                    });

                    var next = $scope.recent[current + 1];
                    if (next) {
                        $scope.active = next;
                    }
                }
            });

            function setActive(entry) {
                $scope.active = entry;
            }

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
