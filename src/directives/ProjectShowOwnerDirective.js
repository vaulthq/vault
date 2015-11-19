(function() {
    angular
        .module('xApp')
        .directive('projectShowOwner', directive);

    function directive() {
        return {
            restrict: 'A',
            scope: {
                projectShowOwner: '='
            },
            link: function(scope, element) {
                element.on('click', scope.openModal);
            },
            controller: function($scope, $modal) {
                $scope.openModal = openModal;

                function openModal() {
                    $modal.open({
                        templateUrl: '/t/project/owner.html',
                        controller: 'ModalProjectOwnerController',
                        resolve: {
                            owner: function(Api) {
                                return Api.user.get({id: $scope.projectShowOwner.user_id});
                            }
                        }
                    });
                }
            }
        };
    }
})();
