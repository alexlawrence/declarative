(function (module) {

    'use strict';

    module.parseOptions = function(input) {
        if (containsDoubleQuotes(input)) {
            generateError('input contains double quotes');
        }
        try {
            input = addMissingQuotesForKeys(input);
            input = replaceSingleWithDoubleQuotes(input);
            input = addCurlyBraces(input);
            return JSON.parse(input);
        }
        catch (error) {
            generateError('JSON parsing error');
        }
    };

    var containsDoubleQuotes = function(input) {
        return input.indexOf('"') > -1;
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

}(declarative));