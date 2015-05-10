(function() {
    angular
        .module('xApp')
        .factory('AuthInterceptor', authInterceptor);

    function authInterceptor($q, $injector, $location, toaster) {
        return {
            response: response,
            responseError: error
        };

        function response(response) {
            return response || $q.when(response);
        }

        function error(rejection) {
            var AuthFactory = $injector.get('AuthFactory');

            if (rejection.status === 400 || rejection.status === 401) {
                if (AuthFactory.isLoggedIn()) {
                    toaster.pop('warning', 'Session Expired', 'Please log in.');
                }
                AuthFactory.logout();
                $location.path('/login');
            }

            if (rejection.status === 403) {
                toaster.pop('error', "Forbidden", 'You cannot access this resource.');
            }

            if (rejection.status === 419) {
                toaster.pop('warning', "Validation Error", rejection.data);
            }

            return $q.reject(rejection);
        }
    }

})();