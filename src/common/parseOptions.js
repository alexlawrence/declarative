define('common/parseOptions', ['common/errors'], function(errors) {

    var parseOptions = function(input) {
        try {
            var output;
            return eval('output = {' + input + '}');
        }
        catch (error) {
            throw new Error(errors.parseOptions);
        }
    };

    return parseOptions;

});