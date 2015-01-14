(function() {
    angular
        .module('xApp')
        .directive('loader', loaderDirective)
        .directive('showPassword', showPasswordDirective)
        .directive('clipCopy', clipCopyDirective)
        .directive('fileRead', fileReadDirective)
        .directive('changeProjectOwner', projectOwnerDirective);

    function loaderDirective() {
        return {
            restrict: 'E',
            scope: {
                when: '='
            },
            template: '<img src="/img/loader.gif" ng-show="when" class="loader">'
        };
    }

    function clipCopyDirective() {
        return {
            scope: {
                clipCopy: '&',
                clipClick: '&'
            },
            restrict: 'A',
            link: function (scope, element, attrs) {
                // Create the clip object
                var clip = new ZeroClipboard(element);
                clip.on( 'load', function(client) {
                    var onDataRequested = function (client) {
                        client.setText(scope.$eval(scope.clipCopy));
                        if (angular.isDefined(attrs.clipClick)) {
                            scope.$apply(scope.clipClick);
                        }
                    };
                    client.on('dataRequested', onDataRequested);

                    scope.$on('$destroy', function() {
                        client.off('dataRequested', onDataRequested);
                        client.unclip(element);
                    });
                });
            }
        };
    }

    function showPasswordDirective() {
        return {
            scope: {
                entryId: '=',
                'elementClass': '=?'
            },
            restrict: 'EA',
            template:
                '<a ng-click="showPassword()" ng-class="elementClass" title="Display Password">' +
                '    <i class="glyphicon glyphicon-lock"></i>' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-info btn-xs';
                $scope.showPassword = showPasswordModal;

                function showPasswordModal() {
                    $modal.open({
                        templateUrl: '/t/entry/password.html',
                        controller: 'ModalGetPasswordController',
                        resolve: {
                            password: function(Api) {
                                return Api.entryPassword.password({id: $scope.entryId});
                            },
                            entry: function(EntryFactory) {
                                return EntryFactory.show({id: $scope.entryId});
                            }
                        }
                    });
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

    function projectOwnerDirective() {
        return {
            scope: {
                projectId: '=',
                elementClass: '=?'
            },
            template:
                '<a ng-click="showModal()" ng-class="elementClass" title="Change Project Owner">' +
                '    <i class="glyphicon glyphicon-share-alt"></i>' +
                '</a>',
            controller: function($scope, $modal) {
                $scope.elementClass = $scope.elementClass || 'btn btn-default';
                $scope.showModal = showModal;

                function showModal() {
                    $modal.open({
                        templateUrl: '/t/project/changeOwner.html',
                        controller: 'ModalChangeProjectOwnerController',
                        resolve: {
                            users: function(Api) {
                                return Api.user.query();
                            },
                            project: function(Api) {
                                return Api.project.get({id: $scope.projectId});
                            }
                        }
                    });
                }
            }
        };
    }

})();
