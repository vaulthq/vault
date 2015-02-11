(function() {
    angular
        .module('xApp')
        .directive('triggerChange', triggerChangeDirective);

    function triggerChangeDirective() {
        return {
            restrict: 'A',
            priority: -10,
            link: function (scope, element) {
                element.on('submit', function(){
                    angular.forEach(element.find('input'), function(field) {
                        angular.element(field).triggerHandler('change');
                    });
                });
            }
        };
    }
})();
