var errors = require('../errors');

var parseOptions = function(input) {
    try {
        var output;
        return eval('output = {' + input + '}');
    }
    catch (error) {
        throw new Error(errors.parseOptions);
    }
};

module.exports = parseOptions;