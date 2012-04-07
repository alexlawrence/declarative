(function() {

    var isArray = internal.array.isArray;
    var ensureArray = internal.array.ensureArray;
    var mappingUtilities = internal.mappingUtilities;

    declarative.mappings = {};

    declarative.mappings.clear = function() {
        mappings = {};
    };

    declarative.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            mappingUtilities.validateMapping(mapping);
            mappingUtilities.completeMapping(mapping);
            mappingUtilities.optimizeMapping(mapping);
            mappings[mapping.id] = mapping;
        }
    };

    declarative.mappings.getAll = function() {
        var mappingsList = [];
        for (var property in mappings) {
            if (mappings.hasOwnProperty(property)) {
                mappingsList.push(mappings[property]);
            }
        }
        return mappingsList;
    };

    declarative.mappings.get = function (ids) {
        if (!isArray(ids)) {
            return getSingleMapping(ids);
        }
        var matches = [];
        for (var i = 0, j = ids.length; i < j; i++) {
            matches.push(getSingleMapping(ids[i]));
        }
        return matches;
    };

    var getSingleMapping = function(id) {
        return mappings[id] || generateError('get', 'invalid id "' + id + '"');
    };

    var generateError = function(method, message) {
        throw new Error('declarative.mappings.' + method + ': ' + message);
    };

    var mappings = {};

}());

