(function() {
    angular
        .module('xApp')
        .factory('AuthFactory', auth);

    function auth($cookieStore, $rootScope, $sanitize, Api, $location, toaster) {
        var cookieName = 'user';

        return {
            login: login,
            logout: logout,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            initLogin: initLogin,
            loginAs: loginAs
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

        function initLogin(username, password, remember) {
            Api.auth.save({
                email: $sanitize(username),
                password: $sanitize(password),
                remember: $sanitize(remember)
            }, function (response) {
                login(response);
                $location.path('/recent');
            }, function (response) {
                toaster.pop('error', "Login Failed", response.data[0]);
            })
        }

        function loginAs(userId) {
            Api.loginAs.get({id: userId}, function(response) {
                logout();
                login(response);
                $location.path('/recent');
            });
        }
    }
})();
