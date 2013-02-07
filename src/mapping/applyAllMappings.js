var mappings = require('./mappings');
var apply = require('./apply');

var applyAllMappings = function () {
    var ids = [], allMappings = mappings.getAll();
    for (var i = 0, j = allMappings.length; i < j; i++) {
        ids.push(allMappings[i].id);
    }
    return apply(ids);
};

module.exports = applyAllMappings;