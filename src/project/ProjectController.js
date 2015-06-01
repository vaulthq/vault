(function() {
    angular
        .module('xApp')
        .controller('ProjectController', controller);

    function controller($scope, projects) {
        $scope.projects = projects;
    }
})();
