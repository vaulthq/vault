(function() {
  angular
    .module('xApp')
    .controller('VaultController', ctrl);

  function ctrl($scope) {
    var vm = this;
    vm.bodyClass = 'default';

    $scope.$on('$stateChangeSuccess', onRouteChange);

    function onRouteChange(event, toState, toParams, fromState, fromParams) {
      if (angular.isDefined(toState.data) && angular.isDefined(toState.data.bodyClass)) {
        vm.bodyClass = toState.data.bodyClass;
        return;
      }

      vm.bodyClass = 'default';
    }
  }
})();
