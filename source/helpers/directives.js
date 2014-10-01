xApp.
    directive('loader', function() {
        return {
            restrict: 'E',
            scope: {
                when: '='
            },
            template: '<img src="/img/loader.gif" ng-show="when" class="loader">'
        };
    })
    .directive('clipCopy', function () {
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
    });