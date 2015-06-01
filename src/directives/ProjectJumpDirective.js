(function() {
    angular
        .module('xApp')
        .directive('projectJump', projectJumpDirective);

    function projectJumpDirective() {
        return {
            restrict: 'E',
            template:
                '<div class="project-jump" ng-class="{in: isActive}"><ui-select ng-model="project" on-select="openProject($item)" focus-on="openJump">' +
                    '<ui-select-match placeholder="Quick project jump">{{ $select.selected.name }}</ui-select-match>' +
                    '<ui-select-choices repeat="project.id as pro in projects | filter: {name: $select.search}">' +
                        '<div ng-bind-html="pro.name | highlight: $select.search"></div>' +
                        '<div class="muted small">{{ pro.description }}</div>' +
                    '</ui-select-choices>' +
                '</ui-select></div>',
            scope: {
                projects: '='
            },
            controller: function($scope, $state, hotkeys) {
                $scope.openProject = openProject;
                $scope.isActive = false;

                $scope.$on('toggleJump', function () {
                    $scope.isActive = !$scope.isActive;
                    $scope.$broadcast('openJump');

                    if ($scope.isActive) {
                        hotkeys.add({
                            combo: 'esc',
                            description: 'Close project jump',
                            allowIn: ['input', 'select'],
                            callback: function() {
                                close();
                            }
                        });
                    } else {
                        close();
                    }
                });

                function close() {
                    $scope.isActive = false;
                    hotkeys.del('esc');
                }

                function openProject(project) {
                    $state.go('user.project', {projectId: project.id});
                    close();
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }
                }
            }
        };
    }
})();
