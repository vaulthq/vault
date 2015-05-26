(function() {
    angular
        .module('xApp')
        .directive('projectJump', projectJumpDirective);

    function projectJumpDirective() {
        return {
            restrict: 'E',
            template:
                '<ui-select ng-model="project" on-select="openProject($item)" class="project-jump">' +
                    '<ui-select-match>Quick project jump</ui-select-match>' +
                    '<ui-select-choices repeat="project.id as pro in projects | filter: {name: $select.search}">' +
                        '{{ pro.name }} <div class="muted small">{{ pro.description }}</div>' +
                    '</ui-select-choices>' +
                '</ui-select>',
            scope: {
                projects: '='
            },
            controller: function($scope, $state) {
                $scope.openProject = openProject;

                function openProject(project) {
                    $state.go('user.project', {projectId: project.id});
                }
            }
        };
    }
})();
