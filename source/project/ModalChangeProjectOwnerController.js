xApp
    .controller('ModalChangeProjectOwnerController', function($scope, $modalInstance, toaster, Api, users, project) {
        $scope.users = users;
        $scope.project = project;
        $scope.form = {owner: 0, assign: 0};

        $scope.project.$promise.then(function() {
            $scope.form.owner = $scope.project.user_id;
        });

        $scope.ok = function () {
            Api.projectOwner.get({
                id: $scope.project.id,
                owner: $scope.form.owner,
                assign: $scope.form.assign
            }, function() {
                $modalInstance.close();
                toaster.pop('success', 'Project owner has been changed.');
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    });
