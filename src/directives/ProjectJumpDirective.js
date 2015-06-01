(function() {
    angular
        .module('xApp')
        .directive('projectJump', projectJumpDirective);

    function projectJumpDirective() {
        return {
            restrict: 'E',
            template:
                '<div class="project-jump" ng-class="{in: isActive}"><ui-select ng-model="project" on-select="openProject($item)" focus-on="openJump">' +
                    '<ui-select-match>Quick project jump</ui-select-match>' +
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

                $scope.$on('openJump', function () {
                    $scope.isActive = true;
                });

                hotkeys.add({
                    combo: 'esc',
                    description: 'Close project jump',
                    allowIn: ['input', 'select'],
                    callback: function(event, hotkey) {
                        $scope.isActive = false;
                    }
                });

                function openProject(project) {
                    $state.go('user.project', {projectId: project.id});
                    $scope.isActive = false;
                }
            }
        };
    }
})();
