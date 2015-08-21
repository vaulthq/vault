(function() {
    angular
        .module('xApp')
        .directive('entryCreate', entryCreateDirective);

    function entryCreateDirective($modal, $rootScope, hotkeys) {
        return {
            restrict: 'A',
            scope: {
                project: '=entryCreate'
            },

            link: function($scope, element) {
                hotkeys.add({
                    combo: 'ctrl+i',
                    description: 'Add new entry',
                    allowIn: ['input', 'select', 'textarea'],
                    callback: function(event, hotkey) {
                        openEntryModal();
                    }
                });

                element.on('click', function() {
                    openEntryModal();
                });

                function openEntryModal() {
                    $modal.open({
                        templateUrl: '/t/entry/form.html',
                        controller: 'ModalCreateEntryController',
                        resolve: {
                            project_id: function () {
                                return $scope.project.id;
                            }
                        }
                    }).result.then(onModalSuccess, onModalDismiss);
                }

                function onModalSuccess(model) {
                    $rootScope.$broadcast('entry:create', model);
                    $rootScope.$broadcast('AppFocus');
                }

                function onModalDismiss() {
                    setTimeout(function(){ $rootScope.$broadcast("AppFocus"); }, 400);
                }

                $scope.$on('$destroy', function(){
                    hotkeys.del('ctrl+i');
                });
            }
        };
    }
})();
