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
                '<a class="btn btn-info btn-xs" ng-click="copy()" title="Copy password" ng-if="isState(\'copy\')">' +
                    '<i class="glyphicon glyphicon-save"></i>' +
                '</a>',
            scope: {
                entry: '='
            },
            controller: function($scope, Api, toaster, $rootScope, CopyService) {
                $scope.state = 'download';
                $scope.isState = isState;
                $scope.download = downloadPassword;
                $scope.copy = copyPassword;
                $scope.password = '';

                $scope.$on('$destroy', cleanup);
                $scope.$on("PasswordRequest", onPasswordRequest);

                function onPasswordRequest(e, entry) {
                    if (entry.id != $scope.entry.id) {
                        return;
                    }

                    if ($scope.state == "download") {
                        downloadPassword();
                        return;
                    }

                    if ($scope.state == "copy") {
                      CopyService.copy($scope.password).then(function() {
                        $rootScope.$broadcast("AppFocus");
                      });
                    }
                }

                function isState(state) {
                    return $scope.state == state;
                }

                function copyPassword() {
                  CopyService.copy($scope.password);
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

                function cleanup() {
                  CopyService.cleanup();
                }
            }
        };
    }
})();
