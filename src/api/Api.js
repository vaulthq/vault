(function() {
    angular
        .module('xApp')
        .factory('Api', apiFactory);

    function apiFactory($resource) {
        return {
            auth: $resource("/internal/auth"),
            project: $resource("/api/project/:id", null, enableCustom),
            projectKeys: $resource("/api/project/keys/:id"),
            projectOwner: $resource("/api/project/changeOwner/:id", null, enableCustom),
            assignedTeams: $resource("/api/project/teams/:id", null, enableCustom),
            user: $resource("/api/user/:id", null, enableCustom),
            apis: $resource("/api/apis/:id", null, enableCustom),
            team: $resource("/api/team/:id", null, enableCustom),
            teamMembers: $resource("/api/teamMembers/:id", null, enableCustom),
            projectTeams: $resource("/api/projectTeams/:id", null, enableCustom),
            entryTeams: $resource("/api/entryTeams/:id", null, enableCustom),
            entryTags: $resource("/api/entryTags/:id", null, enableCustom),
            authStatus: $resource("/internal/auth/status", null),
            profile: $resource("/api/profile", null, enableCustom),
            share: $resource("/api/share/:id", null, enableCustom),
            entry: $resource("/api/entry/:id", null, angular.extend(enableCustom, {
                password: { method: 'GET', params: {id: '@id'} }
            })),
            entryAccess: $resource("/api/entry/access/:id", null),
            entryPassword: $resource("/api/entry/password/:id", {}, {
                password: { method: 'GET', params: {id: '@id'} }
            })
        }
    }

    var enableCustom = {
        update: {
            method: 'PUT', params: {id: '@id'}
        },
        delete: {
            method: 'DELETE', params: {id: '@id'}
        }
    };
})();
