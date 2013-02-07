var mappingModes = require('../mappingModes');

var completeMapping = function(mapping) {
    mapping.prefix = mapping.prefix || '';
    mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    mapping.distinct = (mapping.distinct !== undefined) ? mapping.distinct : true;
};

module.exports = completeMapping;