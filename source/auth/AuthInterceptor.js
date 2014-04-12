xApp.factory('AuthInterceptor', function($q, $injector, $location, flash) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            if (rejection.status === 401) {
                var AuthFactory = $injector.get('AuthFactory');
                AuthFactory.logout();
                flash('warning', 'Session has expired, please try again.');
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
});