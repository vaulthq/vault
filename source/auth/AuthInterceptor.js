xApp.factory('AuthInterceptor', function($q, $injector, $location, flash, $rootScope) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            if (rejection.status === 401) {
                var AuthFactory = $injector.get('AuthFactory');
                if (AuthFactory.getUser().length > 0) {
                    flash('warning', 'Session has expired, please try again.');
                }
                AuthFactory.logout();
                $location.path('/login');
            }
            if (rejection.status === 403) {
                flash('danger', 'You cannot access this resource.');
            }
            return $q.reject(rejection);
        }
    };
});