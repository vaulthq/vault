(function() {
    angular
        .module('xApp')
        .directive('copyPassword', copyPasswordDirective);

    function copyPasswordDirective() {
        return {
            restrict: 'E',
            template:
                '<a ng-click="download()" class="btn btn-default btn-xs" title="Copy password" ng-if="isState(\'download\')">' +
                    '<i class="glyphicon glyphicon-open"></i>' +
                '</a>' +
                '<a class="btn btn-default btn-xs" title="Please wait..." ng-if="isState(\'waiting\')">' +
                    '<i class="fa fa-spinner fa-spin"></i>' +
                '</a>' +
                '<a clip-copy="password" clip-click="copy()" class="btn btn-info btn-xs" title="Copy password" ng-if="isState(\'copy\')">' +
                    '<i class="glyphicon glyphicon-save"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($scope, Api, toaster, $rootScope) {
                $scope.state = 'download';
                $scope.isState = isState;
                $scope.download = downloadPassword;
                $scope.copy = copy;
                $scope.password = '';

                $scope.$on("PasswordRequest", function(e, entry){
                    if (entry.id != $scope.entry.id) {
                        return;
                    }

                    if ($scope.state == "download") {
                        downloadPassword();
                        return;
                    }

                    if ($scope.state == "copy") {
                        var textarea = document.createElement("textarea");
                        textarea.innerHTML = $scope.password;
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            if (document.execCommand("copy")) {
                                copy();
                            }
                        } catch (e) {}
                        document.body.removeChild(textarea);
                        $rootScope.$broadcast("AppFocus");
                    }
                });

                function isState(state) {
                    return $scope.state == state;
                }

                function copy() {
                    toaster.pop('success', "", 'Password copied to clipboard.');
                }

                function downloadPassword() {
                    $scope.state = 'waiting';
                    Api.entryPassword.password({id: $scope.entry.id}, function(response) {
                        $scope.password = response.password;
                        response.$promise.then(function() {
                            $scope.state = 'copy';
                        });
                    });
                }
            }
        };
    }
})();
