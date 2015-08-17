(function() {
    angular
        .module('xApp')
        .controller('EntryController', controller)
        .factory('EntryFactory', function ($resource) {
            return $resource("/api/entry/:id", {}, {
                show: { method: 'GET' },
                update: { method: 'PUT', params: {id: '@id'} },
                password: { method: 'GET', params: {id: '@id'} },
                delete: { method: 'DELETE', params: {id: '@id'} }
            })
        })
        .factory('EntryAccessFactory', function ($resource) {
            return $resource("/api/entry/access/:id", {}, {
                query: { method: 'GET', params: {id: '@id'}, isArray: true }
            })
        });

    function controller($scope, $filter, hotkeys, entries, project, active) {

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
        $scope.$watch("search|json", onFilterChanged);

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
            return $filter('filter')($scope.entries, $scope.search);
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
    }
})();
