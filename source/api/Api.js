xApp
    .factory('Api', function($resource) {
        var enableCustom = {
            update: {
                method: 'PUT', params: {id: '@id'}
            },
            delete: {
                method: 'DELETE', params: {id: '@id'}
            }
        };

        return {
            project: $resource("/api/project/:id", null, enableCustom),
            user: $resource("/api/user/:id", null, enableCustom)
        }
    });

/*

.factory('UsersFactory', function ($resource) {
    return $resource("/api/user", {}, {
        query: { method: 'GET', isArray: true },
        create: { method: 'POST' }
    })
})
    .factory('UserFactory', function ($resource) {
        return $resource("/api/user/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    })
    .factory('ProfileFactory', function ($resource) {
        return $resource("/api/profile", {}, {
            update: { method: 'POST' }
        })
    });*/
