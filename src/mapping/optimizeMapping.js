var hyphenate = require('../common/hyphenate');

var optimizeMapping = function(mapping) {
    mapping.prefix = mapping.prefix.toLowerCase();
    mapping.convertedTypes = [];
    for (var i = 0, j = mapping.types.length; i < j; i++) {
        var hyphenatedType = hyphenate(mapping.types[i]);
        mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
    }
};

module.exports = optimizeMapping;