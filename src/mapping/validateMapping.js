define('mapping/validateMapping', ['mappingModes', 'errors'], function(mappingModes, errors) {

    var validateMapping = function(mapping) {
        if (!mapping) {
            generateError(errors.validateMapping);
        }
        if (!mapping.id) {
            generateError(errors.validateMappingId);
        }
        if (!mapping.types) {
            generateError(errors.validateMappingTypes);
        }
        if (mapping.types && !mapping.types.push) {
            generateError(errors.validateMappingTypesFormat);
        }
        if (!mapping.callback || typeof mapping.callback !== 'function') {
            generateError(errors.validateMappingCallback);
        }
        if (mapping.mappingMode && mapping.mappingMode !== mappingModes.attribute &&
            mapping.mappingMode !== mappingModes.element) {
            generateError(errors.validateMappingMode);
        }
    };

    var generateError = function(message) {
        throw new Error(message);
    };

    return validateMapping;

});