xApp.
    filter('userGroup', function(GROUPS) {
        return function(input) {
            return GROUPS[input];
        }
    });
