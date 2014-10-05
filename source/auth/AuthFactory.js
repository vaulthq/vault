(function() {
    angular
        .module('xApp')
        .factory('AuthFactory', authFactory);

    function authFactory($cookieStore, $rootScope, $sanitize, Api, $location, toaster) {
        var cookieName = 'user';

        return {
            login: login,
            logout: logout,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            initLogin: initLogin
        };

        function login(response) {
            $cookieStore.put(cookieName, response);
            $rootScope.$broadcast('auth:login', getUser());
        }

        function logout() {
            $cookieStore.remove(cookieName);
            $rootScope.$broadcast('auth:login', null);
        }

        function getUser() {
            var fromCookie = $cookieStore.get(cookieName) || [];
            return fromCookie.user || [];
        }

        function isLoggedIn() {
            return getUser().id > 0;
        }

        function initLogin(username, password) {
            Api.auth.save({
                email: $sanitize(username),
                password: $sanitize(password)
            }, function (response) {
                login(response);
                $location.path('/recent');
            }, function (response) {
                toaster.pop('error', "Login Failed", response.data[0]);
            })
        }
    }
})();
