/**
 * @license
 * declarative - Mapper for custom user interface markup - version 1.1.0
 *
 * Copyright 2012, Alex Lawrence
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 *
 */ 
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.declarative = factory();
    }
}(this, function () {

var declarative = {};
var internal = {};
(function() {

    var array = internal.array = {};

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

    internal.hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var upperCaseRegex = new RegExp(/([A-Z])/g);

}());
(function(){

    internal.isDOMElement = function(element) {
        return element &&
            (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
    };

    var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

}());
(function() {

    internal.mappingModes = {
        attribute: 'attribute',
        element: 'element'
    };

}());
(function() {

    var mappingModes = internal.mappingModes;
    var mappingUtilities = internal.mappingUtilities = {};

    mappingUtilities.validateMapping = function(mapping) {
        if (!mapping) {
            generateError('invalid options');
        }
        if (!mapping.id) {
            generateError('missing id');
        }
        if (!mapping.types) {
            generateError('missing types');
        }
        if (mapping.types && !mapping.types.push) {
            generateError('invalid types');
        }
        if (!mapping.callback || typeof mapping.callback !== 'function') {
            generateError('invalid callback');
        }
        if (mapping.mappingMode && mapping.mappingMode !== mappingModes.attribute &&
            mapping.mappingMode !== mappingModes.element) {
            generateError('invalid mappingMode');
        }
    };

    mappingUtilities.completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    };

    mappingUtilities.optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.convertedTypes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = internal.hyphenate(mapping.types[i]);
            mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
        }
    };

    var generateError = function( message) {
        throw new Error('internal.mappingUtilities.validateMapping: ' + message);
    };

}());
(function() {

    var mappingModes = internal.mappingModes;

    internal.generateCssSelectors = function(typesByMappingMode) {
        var attributeSelectors = generateAttributeSelectors(typesByMappingMode[mappingModes.attribute]);
        var elementSelectors = generateElementSelectors(typesByMappingMode[mappingModes.element]);
        return combineSelectors(attributeSelectors, elementSelectors);
    };

    var generateAttributeSelectors = function(attributes) {
        var attributeSelectors = attributes.join('],[');
        if (attributeSelectors) {
            attributeSelectors = '[' + attributeSelectors + ']';
        }
        return attributeSelectors;
    };

    var generateElementSelectors = function(elements) {
        return elements.join(',');
    };

    var combineSelectors = function(left, right) {
        return left + (left && right ? ',' : '') + right;
    };

}());
(function(){

    var mappingModes = internal.mappingModes;

    internal.getRelevantElements = function(mappings, element) {
        if (element.querySelectorAll) {
            return getRelevantElementsByCssSelectors(mappings, element);
        }
        return element.all ? element.all : element.getElementsByTagName('*');
    };

    var getRelevantElementsByCssSelectors = function(mappings, element) {
        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = [];
        for (var i = 0, j = mappings.length; i < j; i++) {
            var mapping = mappings[i], mappingMode = mapping.mappingMode;
            typesByMappingMode[mappingMode] =
                typesByMappingMode[mappingMode].concat(mapping.convertedTypes);
        }
        var selector = internal.generateCssSelectors(typesByMappingMode);
        return element.querySelectorAll(selector);
    };

}());
(function(){

    var isDOMElement = internal.isDOMElement;

    internal.getSpecifiedAttributes = function(element) {
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

    internal.parseOptions = function(input) {
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
(function() {

    var isArray = internal.array.isArray;
    var ensureArray = internal.array.ensureArray;
    var mappingUtilities = internal.mappingUtilities;

    declarative.mappings = {};

    declarative.mappings.clear = function() {
        mappings = {};
    };

    declarative.mappings.add = function(newMappings) {
        newMappings = ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            mappingUtilities.validateMapping(mapping);
            mappingUtilities.completeMapping(mapping);
            mappingUtilities.optimizeMapping(mapping);
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
        return mappings[id] || generateError('get', 'invalid id "' + id + '"');
    };

    var generateError = function(method, message) {
        throw new Error('declarative.mappings.' + method + ': ' + message);
    };

    var mappings = {};

}());


(function() {

    var ensureArray = internal.array.ensureArray;
    var mappingModes = internal.mappingModes;

    declarative.apply = function(ids) {
        var mappings = declarative.mappings.get(ids);
        mappings = ensureArray(mappings);
        return applyMappingsToWrapper(mappings);
    };

    declarative.applyAllMappings = function() {
        var mappings = declarative.mappings.getAll();
        return applyMappingsToWrapper(mappings);
    };

    var applyMappingsToWrapper = function(mappings) {
        return {
            to: function(element) { applyMappingsTo(mappings, element); }
        }
    };

    var applyMappingsTo = function(mappings, rootElement) {
        verifyDOMElement(rootElement);
        var allElements = internal.getRelevantElements(mappings, rootElement), element = rootElement;
        var mapping, elementIndex = allElements.length, attributes;
        var mappingIndex = 0, j = mappings.length, typeIndex = 0, m = 0;
        while (element) {
            attributes = element.attributes;
            for (mappingIndex = 0; mappingIndex < j; mappingIndex++) {
                mapping = mappings[mappingIndex];
                for (typeIndex = 0, m = mapping.convertedTypes.length; typeIndex < m; typeIndex++) {
                    if (mapping.mappingMode === mappingModes.attribute) {
                        applyAttributeMapping(element, mapping, typeIndex);
                    }
                    if (mapping.mappingMode === mappingModes.element) {
                        applyElementMapping(element, mapping, typeIndex);
                    }
                }
            }
            element = elementIndex && allElements[--elementIndex];
        }
    };

    var verifyDOMElement = function(element) {
        if (!internal.isDOMElement(element)) {
            generateError('invalid element (DOM object required)');
        }
    };

    var applyAttributeMapping = function(element, mapping, typeIndex) {
        var attribute = element.getAttributeNode && element.getAttributeNode(mapping.convertedTypes[typeIndex]);
        if (attribute && attribute.specified) {
            var options = internal.parseOptions(attribute.nodeValue);
            mapping.callback(element, mapping.types[typeIndex], options);
        }
    };

    var applyElementMapping = function(element, mapping, typeIndex) {
        if (element.nodeName.toLowerCase() == mapping.convertedTypes[typeIndex]) {
            var options = internal.getSpecifiedAttributes(element);
            mapping.callback(element, mapping.types[typeIndex], options);
        }
    };

    var generateError = function(message) {
        throw new Error('declarative.apply.to: ' + message);
    };

}());


declarative.version = '1.1.0';

return declarative;

}));