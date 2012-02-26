/**
 * @license
 * declarative - Mapper for declarative user interfaces in HTML - version 0.7.0
 *
 * Copyright 2012, Alex Lawrence
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 *
 */ 
(function (global) {

    'use strict';

    var module = global.declarative = {};

}(window));
(function(module) {

    // based on: http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
    module.versionOfInternetExplorer = function() {
        var version = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
              version = parseFloat( RegExp.$1 );
            }
        }
        return version;
    }

}(declarative));
(function(parent) {

    var module = parent.array = {};

    module.ensureArray = function(value) {
        return module.isArray(value) ? value : [value];
    };

    module.isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    module.indexOf = function(haystack, needle) {
        for (var i = 0, j = haystack.length; i < j; i++) {
            if (haystack[i] == needle) {
                return i;
            }
        }
        return -1;
    };

}(declarative));
(function (module, versionOfInternetExplorer) {

    'use strict';

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
        keyWithoutQuotes = new RegExp(/(^|,)\s*(\w+)\s*:/g);

    var actualParseOptions = versionOfInternetExplorer() == 7 ? parseOptionsInIE7 : parseOptionsDefault;

}(declarative, declarative.versionOfInternetExplorer));
(function (module, ensureArray, isArray) {

    'use strict';

    module.mappings = {};

    module.mappings.clear = function() {
        mappings = {};
    };

    module.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            optimizeMapping(mapping);
            mappings[mapping.id] = mapping;
        }
    };

    module.mappings.get = function (ids) {
        if (!isArray(ids)) {
            return getSingleMapping(ids);
        }
        var matches = [];
        for (var i = 0, j = ids.length; i < j; i++) {
            matches.push(getSingleMapping(ids[i]));
        }
        return matches;
    };

    var getSingleMapping = function(id) {
        mappings[id] || generateError('get', 'invalid id "' + id + '"');
        return mappings[id];
    };

    var validateMapping = function(options) {
        if (!options) {
            generateError('add', 'invalid options');
        }
        if (!options.id) {
            generateError('add', 'missing id');
        }
        if (!options.prefix) {
            generateError('add', 'missing prefix');
        }
        if (!options.types) {
            generateError('add', 'missing types');
        }
        if (options.types && !options.types.push) {
            generateError('add', 'invalid types');
        }
        if (!options.callback || typeof options.callback !== 'function') {
            generateError('add', 'invalid callback');
        }
        if (isDuplicate(options.id)) {
            generateError('add', 'duplicate id "' + options.id + '"');
        }
    };

    var generateError = function(method, message) {
        throw new Error('declarative.mappings.' + method + ': ' + message);
    };

    var isDuplicate = function(id) {
        for (var mappingId in mappings) {
            if (mappings.hasOwnProperty(mappingId) && mappingId == id) {
                return true;
            }
        }
        return false;
    };

    var optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.typesAsAttributes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = hyphenate(mapping.types[i]);
            mapping.typesAsAttributes.push(mapping.prefix + hyphenatedType);
        }
    };

    var hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var mappings = {}, upperCaseRegex = new RegExp(/([A-Z])/g);

}(declarative, declarative.array.ensureArray, declarative.array.isArray));
(function(module, indexOf, ensureArray) {

    'use strict';

    module.apply = function(ids) {
        var mappings = module.mappings.get(ids);
        mappings = ensureArray(mappings);
        return {
            to: function(element) {
                verifyThatElementIsDOMObject(element);
                applyMappings(mappings, element);
            }
        };
    };

    var applyMappings = function(mappings, element) {
        var allElements = getRelevantElements(mappings, element);
        var mapping, type, elementIndex = allElements.length, attributes, attribute;
        var i = 0, j = mappings.length, k = 0, l = 0;
        while (element) {
            attributes = element.attributes;
            for (i = 0; i < j; i++) {
                mapping = mappings[i];
                for (k = 0, l = mapping.typesAsAttributes.length; k < l; k++) {
                    attribute = element.getAttributeNode
                        && element.getAttributeNode(mapping.typesAsAttributes[k]);
                    if (attribute && attribute.specified) {
                        type = mapping.types[k];
                        mapping.callback(element, type, module.parseOptions(attribute.nodeValue));
                    }
                }
            }
            element = elementIndex && allElements[--elementIndex];
        }
    };

    var getRelevantElements = function(mappings, element) {
        if (element.querySelectorAll) {
            return getRelevantElementsBySelector(mappings, element);
        }
        return element.all ? element.all : element.getElementsByTagName('*');
    };

    var getRelevantElementsBySelector = function(mappings, element) {
        var attributes = [], attributeSelector, i, j;
        for (i = 0, j = mappings.length; i < j; i++) {
            attributes = attributes.concat(mappings[i].typesAsAttributes);
        }
        attributeSelector = '[' + attributes.join('],[') + ']';
        return element.querySelectorAll(attributeSelector);
    };

    var verifyThatElementIsDOMObject = function(element) {
        if (!element || typeof element.nodeName !== 'string') {
            generateError('invalid element (DOM object required)');
        }
    };

    var generateError = function(message) {
        throw new Error('declarative.apply.to: ' + message);
    };

}(declarative, declarative.array.indexOf, declarative.array.ensureArray));