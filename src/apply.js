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