define('mapping/completeMapping', ['mappingModes'], function(mappingModes) {

    var completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
        mapping.distinct = (mapping.distinct !== undefined) ? mapping.distinct : true;
    };

    return completeMapping;

});