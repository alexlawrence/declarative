(function() {

    var mappingModes = internal.mappingModes;
    var mappingUtilities = internal.mappingUtilities = {};

    mappingUtilities.validateMapping = function(mapping) {
        if (!mapping) {
            generateError('invalid options');
        }
        if (!mapping.id) {
            generateError('missing id');
        }
        if (!mapping.types) {
            generateError('missing types');
        }
        if (mapping.types && !mapping.types.push) {
            generateError('invalid types');
        }
        if (!mapping.callback || typeof mapping.callback !== 'function') {
            generateError('invalid callback');
        }
        if (mapping.mappingMode && mapping.mappingMode !== mappingModes.attribute &&
            mapping.mappingMode !== mappingModes.element) {
            generateError('invalid mappingMode');
        }
    };

    mappingUtilities.completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    };

    mappingUtilities.optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.convertedTypes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = internal.hyphenate(mapping.types[i]);
            mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
        }
    };

    var generateError = function( message) {
        throw new Error('internal.mappingUtilities.validateMapping: ' + message);
    };

}());