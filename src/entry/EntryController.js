(function() {
    angular
        .module('xApp')
        .controller('EntryController', controller);

    function controller($scope, $filter, hotkeys, entries, project, active, $rootScope) {

        $scope.entries = entries;
        $scope.project = project;

        $scope.active = active;

        $scope.search = {};
        $scope.tags = [];

        $scope.setActive = setActive;
        $scope.getFiltered = getFiltered;

        $scope.$on('entry:create', onEntryCreate);
        $scope.$on('entry:update', onEntryUpdate);
        $scope.$on('entry:delete', onEntryDelete);
        $scope.$on('$destroy', onDestroy);
        $scope.$watch("search", onFilterChanged, true);

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
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var previous = getFiltered()[current - 1];
                if (previous) {
                    $scope.active = previous;
                } else {
                    $rootScope.$broadcast("AppFocus");
                }
            }
        });

        hotkeys.add({
            combo: 'down',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.active.id;
                });

                var next = getFiltered()[current + 1];
                if (next) {
                    $scope.active = next;
                }
            }
        });

        function onFilterChanged() {
            var filtered = getFiltered();
            var current = _.findIndex(filtered, function(x) {
                return x.id == $scope.active.id;
            });
            if (current == -1 && filtered.length > 0) {
                $scope.active = filtered[0];
            }
        }

        function getFiltered() {
            return $filter('filter')($scope.entries, { $: $scope.search.query });
        }

        function setActive(entry) {
            $scope.active = entry;
        }

        function onEntryCreate(event, model) {
            $scope.entries.push(model);
        }

        function onEntryUpdate(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries[index] = model;
            }

            setActive(model);
        }

        function onEntryDelete(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries.splice(index, 1);
            }

            setActive({});
        }

        function getEntryIndex(entry) {
            return $scope.entries.map(function(e) {return parseInt(e.id)}).indexOf(parseInt(entry.id));
        }

        function onDestroy() {
            hotkeys.del('return');
            hotkeys.del('up');
            hotkeys.del('down');
        }
    }
})();
