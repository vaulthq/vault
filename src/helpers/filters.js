(function() {
    angular
        .module('xApp')
        .filter('userGroup', groupFilter)
        .filter('nl2br', nl2brFilter);

    function groupFilter(GROUPS) {
        return function(input) {
            return GROUPS[input];
        }
    }

    function nl2brFilter($sce) {
        return function(message, xhtml) {
            var is_xhtml = xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (message + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');

            return $sce.trustAsHtml(msg);
        }
    }
})();
