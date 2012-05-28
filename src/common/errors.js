define('common/errors', function() {

    var errors = {};
    errors.parseOptions = 'declarative: Error parsing options';
    errors.verifyDomElement = 'declarative: Invalid DOM element given';
    errors.getSingleMapping = 'declarative: Mapping id not existing';
    errors.validateMapping = 'declarative: Invalid mapping options';
    errors.validateMappingId = 'declarative: Invalid mapping id';
    errors.validateMappingTypes = 'declarative: Missing mapping types';
    errors.validateMappingTypesFormat = 'declarative: Invalid mapping types';
    errors.validateMappingCallback = 'declarative: Invalid mapping callback';
    errors.validateMappingMode = 'declarative: Invalid mappingMode';

    return errors;

});