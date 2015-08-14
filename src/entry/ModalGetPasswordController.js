(function() {
    angular
        .module('xApp')
        .controller('ModalGetPasswordController', function($scope, $modalInstance, password, entry) {
        $scope.password = password;
        $scope.entry = entry;

        $scope.shown = false;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.show = function() {
            $scope.shown = true;
        };

        $scope.hide = function() {
            $scope.shown = false;
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.download = function() {
            var a = document.createElement('a');
            a.href = 'data:application/octet-stream;charset=utf-8,' + encodeURI($scope.password.password);
            a.target = '_blank';
            a.download = $scope.entry.username ? $scope.entry.username : $scope.entry.id;
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
    });

})();
