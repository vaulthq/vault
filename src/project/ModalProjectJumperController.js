(function() {
    angular
        .module('xApp')
        .controller('ModalProjectJumperController', ctrl);

    function ctrl($rootScope, $scope, $modalInstance, $filter, $state, hotkeys, projects) {
        $scope.projects = projects;
        $scope.search = {query: ''};
        $scope.active = {id: 0};

        $scope.goTo = goTo;
        $scope.getFiltered = getFiltered;
        $scope.setActive = setActive;

        $scope.$watch("search", onFilterChanged, true);

        $rootScope.$broadcast('modal:open');

        $scope.projects.$promise.then(function(){
            if (!$scope.active.id && $scope.projects.length > 0) {
                $scope.active = $scope.projects[0];
            }
        });

        function getFiltered() {
            return $filter('filter')($scope.projects, { $: $scope.search.query });
        }

        function goTo(project){
            $state.go('user.project', {projectId: project.id});
            $modalInstance.dismiss();
        }

        function setActive(entry) {
            $scope.active = entry;
        }

        function onFilterChanged() {
            var filtered = getFiltered();
            var current = _.findIndex(filtered, function(x) {
                return x.id == $scope.active.id;
            });
            if (current == -1 && filtered.length > 0) {
                $scope.active = filtered[0];
            }
        }

        hotkeys.add({
            combo: 'up',
            allowIn: ['input'],
            callback: function(event) {
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
            allowIn: ['input'],
            callback: function(event) {
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

        hotkeys.add({
            combo: 'return',
            allowIn: ['input'],
            callback: function(event) {
                event.preventDefault();
                if ($scope.active.id) {
                    goTo($scope.active);
                }
            }
        });

        $scope.$on('$destroy', function() {
            hotkeys.del('return');
            hotkeys.del('up');
            hotkeys.del('down');

            $rootScope.$broadcast('modal:close');
        });
    }
})();

