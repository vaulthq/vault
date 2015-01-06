(function() {
    angular
        .module('xApp')
        .controller('AssignedTeamController', teamController);

    function teamController($scope, $modalInstance, teams) {
        $scope.teams = teams;

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();
