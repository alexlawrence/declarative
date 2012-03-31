(function() {

    var isArray = internal.array.isArray;
    var ensureArray = internal.array.ensureArray;

    declarative.mappings = {};

    var mappingModes = declarative.mappingModes = {
        attribute: 'attribute',
        element: 'element'
    };

    declarative.mappings.clear = function() {
        mappings = {};
    };

    declarative.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            completeMapping(mapping);
            optimizeMapping(mapping);
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
        mappings[id] || generateError('get', 'invalid id "' + id + '"');
        return mappings[id];
    };

    var validateMapping = function(options) {
        if (!options) {
            generateError('add', 'invalid options');
        }
        if (!options.id) {
            generateError('add', 'missing id');
        }
        if (!options.types) {
            generateError('add', 'missing types');
        }
        if (options.types && !options.types.push) {
            generateError('add', 'invalid types');
        }
        if (!options.callback || typeof options.callback !== 'function') {
            generateError('add', 'invalid callback');
        }
        if (options.mappingMode &&
            options.mappingMode !== mappingModes.attribute && options.mappingMode !== mappingModes.element) {
            generateError('add', 'invalid mappingMode');
        }
        if (isDuplicate(options.id)) {
            generateError('add', 'duplicate id "' + options.id + '"');
        }
    };

    var generateError = function(method, message) {
        throw new Error('declarative.mappings.' + method + ': ' + message);
    };

    var isDuplicate = function(id) {
        for (var mappingId in mappings) {
            if (mappings.hasOwnProperty(mappingId) && mappingId == id) {
                return true;
            }
        }
        return false;
    };

    var completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    };

    var optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.convertedTypes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = hyphenate(mapping.types[i]);
            mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
        }
    };

    var hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var mappings = {}, upperCaseRegex = new RegExp(/([A-Z])/g);

}());

