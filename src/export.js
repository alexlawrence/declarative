var declarative = {};
require(
    ['common/mappingModes', 'mappings', 'apply', 'applyAllMappings'],
    function(mappingModes, mappings, apply, applyAllMappings) {
        declarative.mappingModes = mappingModes;
        declarative.mappings = mappings;
        declarative.apply = apply;
        declarative.applyAllMappings = applyAllMappings;
    }
);