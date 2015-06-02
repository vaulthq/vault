(function() {
    angular
        .module('xApp')
        .controller('EntryController', controller);

    function controller($scope, $filter, hotkeys, modal, entries, project, active, $state) {

        $scope.entries = entries;
        $scope.project = project;
        $scope.activeId = active;
        $scope.search = {};

        $scope.copyFirst = copyFirst;
        $scope.setActive = setActive;
        $scope.getFiltered = getFiltered;

        $scope.$on('entry:create', onEntryCreate);
        $scope.$on('entry:update', onEntryUpdate);
        $scope.$on('entry:delete', onEntryDelete);


        hotkeys.add({
            combo: 'up',
            description: 'Show project jump window',
            allowIn: ['input', 'select', 'textarea'],
            callback: function(event, hotkey) {
                event.preventDefault();
                var current = _.findIndex(getFiltered(), function(x) {
                    return x.id == $scope.activeId;
                });

                var previous = getFiltered()[current - 1];
                if (previous) {
                    $scope.activeId = previous.id;
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
                    return x.id == $scope.activeId;
                });

                var next = getFiltered()[current + 1];
                if (next) {
                    $scope.activeId = next.id;
                }
            }
        });

        function getFiltered() {
            return $filter('filter')($scope.entries, $scope.search);
        }

        function setActive(id) {
            $scope.activeId = id;
        }

        function copyFirst($event) {
            //if ($event.which === 13) {
            //    var entry = ;
            //    if (entry) {
            //        modal.showPassword(entry.id);
            //    }
            //}
        }

        function onEntryCreate(event, model) {
            $scope.entries.push(model);
        }

        function onEntryUpdate(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries[index] = model;
            }
        }

        function onEntryDelete(event, model) {
            var index = getEntryIndex(model);

            if (index >= 0) {
                $scope.entries.splice(index, 1);
            }
        }

        function getEntryIndex(entry) {
            return $scope.entries.map(function(e) {return parseInt(e.id)}).indexOf(parseInt(entry.id));
        }
    }
})();

xApp
    .factory('EntriesFactory', function ($resource) {
        return $resource("/api/entry", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
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
