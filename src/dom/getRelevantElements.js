var generateCssSelectors = require('./generateCssSelectors');
var mappingModes = require('../mappingModes');

var getRelevantElements = function(element, mappings) {
    if (element.querySelectorAll) {
        return getRelevantElementsByCssSelectors(element, mappings);
    }
    return element.all ? element.all : element.getElementsByTagName('*');
};

var getRelevantElementsByCssSelectors = function(element, mappings) {
    var typesByMappingMode = {};
    typesByMappingMode[mappingModes.attribute] = [];
    typesByMappingMode[mappingModes.element] = [];
    for (var i = 0, j = mappings.length; i < j; i++) {
        var mapping = mappings[i], mappingMode = mapping.mappingMode;
        typesByMappingMode[mappingMode] =
            typesByMappingMode[mappingMode].concat(mapping.convertedTypes);
    }
    var selector = generateCssSelectors(typesByMappingMode);
    return element.querySelectorAll(selector);
};

module.exports = getRelevantElements;