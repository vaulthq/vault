(function() {
    angular
        .module('xApp')
        .factory('AuthFactory', auth);

    function auth($cookieStore, $rootScope, $sanitize, Api, $location, toaster, jwtHelper) {
        var localToken = 'auth_token';

        return {
            login: login,
            logout: logout,
            getUser: getUser,
            isLoggedIn: isLoggedIn,
            initLogin: initLogin,
            loginAs: loginAs,
            getToken: getToken,
            tokenExpired: tokenExpired
        };

        function getToken() {
            return localStorage.getItem(localToken);
        }

        function login(token) {
            localStorage.setItem(localToken, token);
            $rootScope.$broadcast('auth:login', getUser());
        }

        function logout() {
            localStorage.removeItem(localToken);
            $rootScope.$broadcast('auth:login', null);
        }

        function getUser() {
            var token = getToken();
            if (token) {
                try {
                    return jwtHelper.decodeToken(token).user;
                } catch(err) {}
            }
            return [];
        }

        function tokenExpired() {
            return jwtHelper.isTokenExpired(getToken());
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
                login(response.token);
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
