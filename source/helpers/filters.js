xApp.
    filter('userGroup', function() {
        return function(input) {
            var inputs = {
                admin: 'Administrator',
                dev: 'Developer',
                tester: 'Tester',
                pm: 'Project Manager'
            };

            return inputs[input];
        }
    });