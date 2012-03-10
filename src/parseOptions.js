(function() {

    var JSONisAvailable = declarative.versionOfInternetExplorer() != 7;

    declarative.parseOptions = function(input) {
        try {
            return parsingStrategy(input);
        }
        catch (error) {
            generateError('JSON parsing error');
        }
    };

    var parseUsingJson = function(input) {
        input = addMissingQuotesForKeys(input);
        input = replaceSingleWithDoubleQuotes(input);
        input = addCurlyBraces(input);
        return JSON.parse(input);
    };

    var parseUsingEval = function(input) {
        eval('var output = {' + input + '};');
        return output;
    };

    var addMissingQuotesForKeys = function(input) {
        return input.replace(keyWithoutQuotes, '$1"$2":');
    };

    var replaceSingleWithDoubleQuotes = function(input) {
        return input.replace(singleQuoteRegex, '"');
    };

    var addCurlyBraces = function(input) {
        return '{' + input + '}';
    };

    var generateError = function(message) {
        throw new Error('declarative.parseOptions: ' + message);
    };

    var singleQuoteRegex = new RegExp(/'/g),
        keyWithoutQuotes = new RegExp(/(^|,)\s*(\w+)\s*:/g);

    var parsingStrategy = JSONisAvailable ? parseUsingJson : parseUsingEval;

}());