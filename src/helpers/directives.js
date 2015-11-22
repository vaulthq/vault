(function() {
    angular
        .module('xApp')
        .directive('loader', loaderDirective)
        .directive('showPassword', showPasswordDirective)
        .directive('fileRead', fileReadDirective);

    function loaderDirective() {
        return {
            restrict: 'E',
            scope: {
                when: '=',
                type: '='
            },
            template: '<div class="loading-holder" ng-show="when"><ul class="loading"><li></li><li></li><li></li></ul></div>'
        };
    }

    function showPasswordDirective() {
        return {
            scope: {
                entry: '=showPassword'
            },
            restrict: 'A',
            link: function($scope, element) {
                element.on('click', function() {
                    if ($scope.entry.can_edit || $scope.entry.can_edit == undefined) {
                        $scope.showPassword();
                    }
                });
            },
            controller: function($scope, $modal, modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-info btn-xs';
                $scope.showPassword = showPasswordModal;

                function showPasswordModal() {
                    modal.showPassword($scope.entry.id);
                }
            }
        };
    }

    function fileReadDirective() {
        return {
            restrict: 'A',
            scope: {
                content: '=',
                name: '='
            },
            link: function(scope, element, attrs) {
                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();
                    var file = (onChangeEvent.srcElement || onChangeEvent.target).files[0];

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            scope.content = onLoadEvent.target.result;
                            scope.name = file.name;
                        });
                    };
                    reader.readAsText(file);
                });
            }
        };
    }

})();
