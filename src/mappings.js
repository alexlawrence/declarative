(function (module, ensureArray, isArray) {

    'use strict';

    module.mappings = {};

    module.mappings.clear = function() {
        mappings = {};
    };

    module.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            optimizeMapping(mapping);
            mappings[mapping.id] = mapping;
        }
    };

    module.mappings.get = function (ids) {
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
        if (!options.prefix) {
            generateError('add', 'missing prefix');
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

    var optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.typesAsAttributes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = hyphenate(mapping.types[i]);
            mapping.typesAsAttributes.push(mapping.prefix + hyphenatedType);
        }
    };

    var hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var mappings = {}, upperCaseRegex = new RegExp(/([A-Z])/g);

}(declarative, declarative.array.ensureArray, declarative.array.isArray));