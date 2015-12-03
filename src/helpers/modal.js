(function () {
    angular
        .module('xApp')
        .factory('modal', modal);

    function modal($modal) {
        return {
            showPassword: showPassword
        };

        function showPassword(entryId) {
            return $modal.open({
                templateUrl: 'entry/password.html',
                controller: 'ModalGetPasswordController',
                resolve: {
                    password: function (Api) {
                        return Api.entryPassword.password({id: entryId});
                    },
                    entry: function (Api) {
                        return Api.entry.get({id: entryId});
                    }
                }
            });
        }
    }
})();
