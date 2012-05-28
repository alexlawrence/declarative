define('applyMappingsTo',
    ['common/array', 'common/errors', 'common/parseOptions', 'common/mappingModes',
        'dom/isDomElement', 'dom/getRelevantElements', 'dom/getSpecifiedAttributes'],
    function(array, errors, parseOptions, mappingModes,
             isDomElement, getRelevantElements, getSpecifiedAttributes) {

        var applyMappingsToWrapper = function(mappings) {
            return {
                to: function(element) { applyMappingsTo(mappings, element); }
            }
        };

        var applyMappingsTo = function(mappings, rootElement) {
            verifyDomElement(rootElement);
            var allElements = getRelevantElements(rootElement, mappings);
            var mapping, attributes, elementIndex = allElements.length;
            var element = rootElement != document ? rootElement : allElements[--elementIndex];
            var mappingIndex = 0, j = mappings.length, typeIndex = 0, m = 0;
            while (element) {
                attributes = element.attributes;
                for (mappingIndex = 0; mappingIndex < j; mappingIndex++) {
                    mapping = mappings[mappingIndex];
                    for (typeIndex = 0, m = mapping.convertedTypes.length; typeIndex < m; typeIndex++) {
                        if (elementShouldNotBeMapped(mapping, element, mapping.convertedTypes[typeIndex])) {
                            continue;
                        }
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

        var verifyDomElement = function(element) {
            if (!isDomElement(element)) {
                throw new Error(errors.verifyDomElement);
            }
        };

        var elementShouldNotBeMapped = function(mapping, element, type) {
            var id = element.getAttribute(idAttributeName);
            return mapping.distinct && (id > 0) && array.indexOf(appliedMappings[id], type) > -1;
        };

        var applyAttributeMapping = function(element, mapping, typeIndex) {
            var attribute = element.getAttributeNode(mapping.convertedTypes[typeIndex]);
            if (attribute && attribute.specified) {
                var options = parseOptions(attribute.nodeValue);
                mapping.callback(element, mapping.types[typeIndex], options);
                saveAppliedMappingInfo(element, mapping, mapping.types[typeIndex]);
            }
        };

        var applyElementMapping = function(element, mapping, typeIndex) {
            if (element.nodeName.toLowerCase() == mapping.convertedTypes[typeIndex]) {
                var options = getSpecifiedAttributes(element);
                mapping.callback(element, mapping.types[typeIndex], options);
                saveAppliedMappingInfo(element, mapping, mapping.types[typeIndex]);
            }
        };

        var saveAppliedMappingInfo = function(element, mapping, type) {
            if (mapping.distinct) {
                var id = element.getAttribute(idAttributeName);
                if (!id) {
                    id = currentId++;
                    element.setAttribute(idAttributeName, id);
                }
                appliedMappings[id] = appliedMappings[id] || [];
                appliedMappings[id].push(type);
            }
        };

        var appliedMappings = {}, idAttributeName = 'data-declarative-id', currentId = 1;

        return applyMappingsToWrapper;

    }
);