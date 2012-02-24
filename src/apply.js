(function(module, indexOf, ensureArray) {

    'use strict';

    module.apply = function(ids) {
        var mappings = module.mappings.get(ids);
        mappings = ensureArray(mappings);
        return {
            to: function(element) {
                applyMappingsTo(mappings, element);
            }
        };
    };

    var applyMappingsTo = function(mappings, element) {
        verifyThatElementIsDOMObject(element);
        var allElements = element.all ? element.all : element.getElementsByTagName('*');
        var mapping, type, elementIndex = allElements.length, attributes, attributeValue;
        var i = 0, j = mappings.length, k = 0, l = 0;
        while (element) {
            attributes = element.attributes;
            for (i = 0; i < j; i++) {
                mapping = mappings[i];
                for (k = 0, l = mapping.typesAsAttributes.length; k < l; k++) {
                    attributeValue = element.getAttribute && element.getAttribute(mapping.typesAsAttributes[k]);
                    if (attributeValue) {
                        type = mapping.types[k];
                        mapping.callback(element, type, module.parseOptions(attributeValue));
                    }
                }
            }
            element = elementIndex && allElements[--elementIndex];
        }
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