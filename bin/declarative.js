/**
 * @license
 * declarative - Mapper for custom user interface markup - version 1.0.2
 *
 * Copyright 2012, Alex Lawrence
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 *
 */ 
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.declarative = factory();
    }
}(this, function () {

var declarative = {};
(function() {

    var array = declarative.array = {};

    array.ensureArray = function(value) {
        return array.isArray(value) ? value : [value];
    };

    array.isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    array.indexOf = function(haystack, needle) {
        for (var i = 0, j = haystack.length; i < j; i++) {
            if (haystack[i] == needle) {
                return i;
            }
        }
        return -1;
    };

}());
(function(){

    declarative.isDOMElement = function(element) {
        return element &&
            (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
    };

    var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

}());
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
(function(){

    var isDOMElement = declarative.isDOMElement;

    declarative.getSpecifiedAttributes = function(element) {
        verifyDOMElement(element);
        var attributes = element.attributes, attribute, specifiedAttributes = {};
        for (var i = 0, j = attributes.length; i < j; i++) {
            attribute = attributes[i];
            if (attribute.specified) {
                specifiedAttributes[attribute.nodeName] = attribute.nodeValue;
            }
        }
        return specifiedAttributes;
    };

    var verifyDOMElement = function(element) {
        if (!isDOMElement(element)) {
            throw new Error('declarative.getSpecifiedAttributes: invalid element (DOM element required)');
        }
    };

}());
(function() {

    var isArray = declarative.array.isArray;
    var ensureArray = declarative.array.ensureArray;

    declarative.mappings = {};

    var mappingModes = declarative.mappingModes = {
        attribute: 'attribute',
        element: 'element'
    };

    declarative.mappings.clear = function() {
        mappings = {};
    };

    declarative.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            completeMapping(mapping);
            optimizeMapping(mapping);
            mappings[mapping.id] = mapping;
        }
    };

    declarative.mappings.getAll = function() {
        var mappingsList = [];
        for (var property in mappings) {
            if (mappings.hasOwnProperty(property)) {
                mappingsList.push(mappings[property]);
            }
        }
        return mappingsList;
    };

    declarative.mappings.get = function (ids) {
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
        if (!options.types) {
            generateError('add', 'missing types');
        }
        if (options.types && !options.types.push) {
            generateError('add', 'invalid types');
        }
        if (!options.callback || typeof options.callback !== 'function') {
            generateError('add', 'invalid callback');
        }
        if (options.mappingMode &&
            options.mappingMode !== mappingModes.attribute && options.mappingMode !== mappingModes.element) {
            generateError('add', 'invalid mappingMode');
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

    var completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    };

    var optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.convertedTypes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = hyphenate(mapping.types[i]);
            mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
        }
    };

    var hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var mappings = {}, upperCaseRegex = new RegExp(/([A-Z])/g);

}());


(function() {

    var ensureArray = declarative.array.ensureArray;
    var isDOMElement = declarative.isDOMElement;
    var mappingModes = declarative.mappingModes;

    declarative.apply = function(ids) {
        var mappings = declarative.mappings.get(ids);
        mappings = ensureArray(mappings);
        return {
            to: function(element) { apply(mappings, element); }
        };
    };

    declarative.applyAllMappings = function() {
        var mappings = declarative.mappings.getAll();
        return {
            to: function(element) { apply(mappings, element); }
        }
    };

    var apply = function(mappings, element) {
        verifyDOMElement(element);
        var allElements = getRelevantElements(mappings, element);
        var mapping, elementIndex = allElements.length, attributes, attribute;
        var i = 0, j = mappings.length, k = 0, m = 0, options;
        while (element) {
            attributes = element.attributes;
            for (i = 0; i < j; i++) {
                mapping = mappings[i];
                for (k = 0, m = mapping.convertedTypes.length; k < m; k++) {
                    if (mapping.mappingMode === mappingModes.attribute) {
                        attribute = element.getAttributeNode && element.getAttributeNode(mapping.convertedTypes[k]);
                        if (attribute && attribute.specified) {
                            options = declarative.parseOptions(attribute.nodeValue);
                            mapping.callback(element, mapping.types[k], options);
                        }
                    }
                    if (mapping.mappingMode === mappingModes.element) {
                        if (element.nodeName.toLowerCase() == mapping.convertedTypes[k]) {
                            options = declarative.getSpecifiedAttributes(element);
                            mapping.callback(element, mapping.types[k], options);
                        }
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
        var seekedByType = {};
        seekedByType[mappingModes.attribute] = [];
        seekedByType[mappingModes.element] = [];
        for (var i = 0, j = mappings.length; i < j; i++) {
            var mapping = mappings[i];
            seekedByType[mapping.mappingMode] = seekedByType[mapping.mappingMode].concat(mapping.convertedTypes);
        }
        var selector = generateSelector(seekedByType);
        return element.querySelectorAll(selector);
    };

    var generateSelector = function(seekedByType) {
        var attributeSelector = seekedByType[mappingModes.attribute].join('],[');
        if (attributeSelector) {
            attributeSelector = '[' + attributeSelector + ']';
        }
        var elementSelector = seekedByType[mappingModes.element].join(',');
        return attributeSelector + (attributeSelector && elementSelector ? ',' : '') + elementSelector;
    };

    var verifyDOMElement = function(element) {
        if (!isDOMElement(element)) {
            generateError('invalid element (DOM object required)');
        }
    };

    var generateError = function(message) {
        throw new Error('declarative.apply.to: ' + message);
    };

}());


return declarative;

}));