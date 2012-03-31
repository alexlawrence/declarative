(function() {

    declarative.parseOptions = function(input) {
        try {
            return parseUsingEval(input);
        }
        catch (error) {
            generateError('Parsing error');
        }
    };

    var parseUsingEval = function(input) {
        var output;
        return eval('output = {' + input + '}');
    };

    var generateError = function(message) {
        throw new Error('declarative.parseOptions: ' + message);
    };

}());