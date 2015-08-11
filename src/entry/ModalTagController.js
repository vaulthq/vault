(function() {
    angular
        .module('xApp')
        .controller('ModalTagController', ctrl);

    function ctrl($scope, $modalInstance, Api, entry, tags) {
        $scope.tags = tags;
        $scope.entry = entry;

        $scope.tag_color = '#dbdbdb';
        $scope.tag_name = '';

        $scope.createTag = function() {
            Api.entryTags.save({color: $scope.tag_color, name: $scope.tag_name, entryId: entry.id}, function(res) {
                $scope.entry.tags.push(res);
                $scope.tags.push(res);
                $scope.tag_color = '#dbdbdb';
                $scope.tag_name = '';
            });
        };

        $scope.removeTag = function(tag) {
            Api.entryTags.delete({id: tag.id}, function() {
                var index = $scope.entry.tags.map(function (e) { return e.id; }).indexOf(tag.id);
                $scope.entry.tags.splice(index, 1);

                if (_.findWhere($scope.tags, {name: tag.name, entry_id: entry.id})) {
                    var tagIndex = $scope.tags.map(function (e) { return e.name; }).indexOf(tag.name);
                    $scope.tags.splice(tagIndex, 1);
                }
            });
        };

        $scope.addTag = function(tag) {
            Api.entryTags.save({color: tag.color, name: tag.name, entryId: entry.id}, function(res) {
                $scope.entry.tags.push(res);
            });
        };

        $scope.availableTags = function() {
            return _.filter($scope.tags, function(obj) {
                return !_.findWhere($scope.entry.tags, {name: obj.name});
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
})();
