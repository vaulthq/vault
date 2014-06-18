xApp.factory('AuthInterceptor', function($q, $injector, $location, shareFlash) {
    return {
        'response': function(response) {
            return response || $q.when(response);
        },

        'responseError': function(rejection) {
            if (rejection.status === 401) {
                var AuthFactory = $injector.get('AuthFactory');
                if (AuthFactory.isLoggedIn()) {
                    shareFlash('warning', 'Session has expired, please try again.');
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