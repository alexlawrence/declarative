(function (module, versionOfInternetExplorer) {

    module.parseOptions = function(input) {
        try {
            return actualParseOptions(input);
        }
        catch (error) {
            generateError('JSON parsing error');
        }
    };

    var parseOptionsDefault = function(input) {
        input = addMissingQuotesForKeys(input);
        input = replaceSingleWithDoubleQuotes(input);
        input = addCurlyBraces(input);
        return JSON.parse(input);
    };

    var parseOptionsInIE7 = function(input) {
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
        keyWithoutQuotes = new RegExp(/(^|,)(\w+)\s*:/g);

    var actualParseOptions = versionOfInternetExplorer() == 7 ? parseOptionsInIE7 : parseOptionsDefault;

}(declarative, declarative.versionOfInternetExplorer));