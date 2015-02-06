/*global angular */
/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
(function () {
    angular
        .module('xApp')
        .directive('appFocus', appFocusDirective);

    function appFocusDirective($parse) {
        return function (scope, elem, attrs) {
            var select = attrs.hasOwnProperty('appFocusSelect');
            var optionsFn = angular.noop;
            if (select) {
                optionsFn = $parse(attrs.appFocusSelect) || optionsFn;
            }
            if (!attrs.appFocus) {
                focus();
            } else {
                scope.$watch(attrs.appFocus, function (newVal) {
                    if (newVal) {
                        focus();
                    }
                });
            }
            function focus() {
                setTimeout(function () {
                    elem[0].focus();
                    select && selectInput();
                }, 200);
            }

            function selectInput() {
                var options = optionsFn(scope);
                if (options) {
                    elem[0].setSelectionRange(
                        options.start || 0,
                        options.end || 0
                    );
                } else {
                    elem[0].select();
                }
            }
        };
    }
})();
