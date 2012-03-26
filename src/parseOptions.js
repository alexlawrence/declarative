(function() {

    declarative.parseOptions = function(input) {
        return parseUsingEval(input);
        try {
            return parseUsingEval(input);
        }
        catch (error) {
            generateError('JSON parsing error');
        }
    };

    var parseUsingEval = function(input) {
        eval('var output = {' + input + '};');
        return output;
    };

    var generateError = function(message) {
        throw new Error('declarative.parseOptions: ' + message);
    };

}());