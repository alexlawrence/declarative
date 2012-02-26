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