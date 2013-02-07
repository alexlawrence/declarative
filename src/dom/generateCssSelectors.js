var mappingModes = require('../mappingModes');

var generateCssSelectors = function(typesByMappingMode) {
    var attributeSelectors = generateAttributeSelectors(typesByMappingMode[mappingModes.attribute]);
    var elementSelectors = generateElementSelectors(typesByMappingMode[mappingModes.element]);
    return combineSelectors(attributeSelectors, elementSelectors);
};

var generateAttributeSelectors = function(attributes) {
    var attributeSelectors = attributes.join('],[');
    if (attributeSelectors) {
        attributeSelectors = '[' + attributeSelectors + ']';
    }
    return attributeSelectors;
};

var generateElementSelectors = function(elements) {
    return elements.join(',');
};

var combineSelectors = function(left, right) {
    return left + (left && right ? ',' : '') + right;
};

module.exports = generateCssSelectors;