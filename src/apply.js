(function() {

    var ensureArray = internal.array.ensureArray;
    var isDOMElement = internal.isDOMElement;
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