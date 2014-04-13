xApp
    .factory('EntriesFactory', function ($resource) {
        return $resource("/api/entry", {}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' }
        })
    })
    .factory('EntryFactory', function ($resource) {
        return $resource("/api/entry/:id", {}, {
            show: { method: 'GET' },
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    });