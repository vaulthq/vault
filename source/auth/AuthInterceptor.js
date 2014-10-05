xApp.factory('AuthInterceptor', function($q, $injector, $location, shareFlash) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            var AuthFactory = $injector.get('AuthFactory');

            if (rejection.status === 420) {
                if (AuthFactory.isLoggedIn()) {
                    shareFlash('warning', 'Session has expired, re-logging in...');
                }
                location.reload();
            }
            if (rejection.status === 401) {
                if (AuthFactory.isLoggedIn()) {
                    shareFlash('warning', 'Session has expired, please log in.');
                }
                AuthFactory.logout();
                $location.path('/login');
            }
            if (rejection.status === 403) {
                shareFlash('danger', 'You cannot access this resource.');
            }
            return $q.reject(rejection);
        }
    };
});