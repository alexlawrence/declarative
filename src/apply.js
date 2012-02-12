(function(module) {

    'use strict';

    module.apply = function(id) {
        var mapping = module.mappings.get(id);
        return {
            to: function(element) { applyTo(mapping, element); }
        };
    };

    var applyTo = function(mapping, element) {
        verifyThatElementIsDOMObject(element);
        var attributePrefix = mapping.attributePrefix.toLowerCase();
        var validTypes = mapping.validTypes, callback = mapping.callback;
        var children = element.getElementsByTagName('*'), currentElement = element;
        var currentIndex = children.length, attributes;
        while (currentElement) {
            attributes = currentElement.attributes || [];
            forEachMatchingAttribute(attributes, attributePrefix, function(type, options) {
                if (!validTypes || indexOf(validTypes, type) > -1) {
                    callback(currentElement, type, options);
                }
            });
            currentElement = currentIndex && children[--currentIndex];
        }
    };

    var indexOf = function(haystack, needle) {
        for (var i = 0, j = haystack.length; i < j; i++) {
            if (haystack[i] == needle) {
                return i;
            }
        }
        return -1;
    };

    var forEachMatchingAttribute = function(attributes, attributePrefix, callback) {
        forEachAttribute(attributes, function(attributeName, attributeValue) {
            if (attributeName.indexOf(attributePrefix) != 0) {
                return undefined;
            }
            var type = readType(attributeName, attributePrefix);
            var options = module.parseOptions(attributeValue);
            callback(type, options);
        });
    };

    var forEachAttribute = function(attributes, callback) {
        var i, length = attributes.length, attribute;
        for (i = 0; i < length; i++) {
            attribute = attributes[i];
            callback(attribute.nodeName, attribute.nodeValue);
        }
    };

    var readType = function(attributeName, attributePrefix) {
        var type = attributeName.substring(attributePrefix.length);
        type = type.toLowerCase();
        type = type.replace(hyphenatedRegex, function(completeMatch, character) {
            return character.toUpperCase();
        });
        return type;
    };

    var verifyThatElementIsDOMObject = function(element) {
        if (!element || typeof element.nodeName !== 'string') {
            generateError('invalid element (DOM object required)');
        }
    };

    var generateError = function(message) {
        throw new Error('declarative.apply.to: ' + message);
    };

    var hyphenatedRegex = new RegExp(/-(.)/g);

}(declarative));