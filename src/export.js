var declarative = {};
require(
    ['mappingModes', 'mapping/mappings', 'mapping/apply', 'mapping/applyAllMappings', 'settings'],
    function(mappingModes, mappings, apply, applyAllMappings, settings) {
        declarative.mappingModes = mappingModes;
        declarative.mappings = mappings;
        declarative.apply = apply;
        declarative.applyAllMappings = applyAllMappings;
        declarative.settings = settings;
    }
);