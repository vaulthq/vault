(function() {
    angular
        .module('xApp')
        .controller('ModalCreateProjectController', ctrl);

    function ctrl($scope, $modalInstance, $state, Api, toaster) {
        $scope.project = {};

        $scope.ok = function () {
            Api.project.save($scope.project,
                function(response) {
                    $modalInstance.close(response);
                    toaster.pop('success', 'Project successfully created!');
                    $state.go('user.project', {projectId: response.id});
                }
            );
        };
    }
})();

