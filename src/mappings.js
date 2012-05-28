define('mappings',
    ['common/errors', 'common/array', 'processing/validateMapping', 'processing/completeMapping', 'processing/optimizeMapping'],
    function(errors, array, validateMapping, completeMapping, optimizeMapping) {

    var mappings = {};

    mappings.clear = function() {
        registeredMappings = {};
    };

    mappings.add = function(newMappings) {
        newMappings = array.ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            completeMapping(mapping);
            optimizeMapping(mapping);
            registeredMappings[mapping.id] = mapping;
        }
    };

    mappings.getAll = function() {
        var mappingsList = [];
        for (var property in registeredMappings) {
            if (registeredMappings.hasOwnProperty(property)) {
                mappingsList.push(registeredMappings[property]);
            }
        }
        return mappingsList;
    };

    mappings.get = function (ids) {
        if (!array.isArray(ids)) {
            return getSingleMapping(ids);
        }
        var matches = [];
        for (var i = 0, j = ids.length; i < j; i++) {
            matches.push(getSingleMapping(ids[i]));
        }
        return matches;
    };

    var getSingleMapping = function(id) {
        return registeredMappings[id] || throwNewError();
    };

    var throwNewError = function() {
        throw new Error(errors.getSingleMapping);
    };

    var registeredMappings = {};

        return mappings;

});

