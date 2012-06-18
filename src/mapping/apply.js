define('mapping/apply',
    ['mappingModes', 'errors', 'settings',
        'common/array', 'common/parseOptions', 'common/async', 'common/Deferred',
        'dom/isDomElement', 'dom/getSpecifiedAttributes', 'dom/getRelevantElements',
        'mapping/mappings'],
    function(mappingModes, errors, settings,
        array, parseOptions, async, Deferred,
        isDomElement, getSpecifiedAttributes, getRelevantElements, mappings) {

        var apply = function (ids) {
            var mappingsToApply = mappings.get(ids);
            mappingsToApply = array.ensureArray(mappingsToApply);
            return applyMappingsToWrapper(mappingsToApply);
        };

        var applyMappingsToWrapper = function(mappings) {
            return {
                to: function(element) {
                    return applyMappingsTo(mappings, element);
                }
            };
        };

        var applyMappingsTo = function(mappings, rootElement) {
            verifyDomElement(rootElement);
            var allElements = getRelevantElements(rootElement, mappings);
            var mapping, attributes, elementIndex = allElements.length;
            var element = rootElement != document ? rootElement : allElements[--elementIndex];
            var mappingIndex = 0, j = mappings.length, typeIndex = 0, m = 0;
            var deferred = new Deferred();

            async(function(elapsedTime, scheduleNext) {
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

                    if (elapsedTime() > settings.mappingTimeoutMs) {
                        scheduleNext(settings.mappingWaitTimeMs);
                        return;
                    }
                }
                deferred.resolve();
            });

            return deferred;
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
                saveAppliedMappingInfo(element, mapping, mapping.convertedTypes[typeIndex]);
            }
        };

        var applyElementMapping = function(element, mapping, typeIndex) {
            if (element.nodeName.toLowerCase() == mapping.convertedTypes[typeIndex]) {
                var options = getSpecifiedAttributes(element);
                mapping.callback(element, mapping.types[typeIndex], options);
                saveAppliedMappingInfo(element, mapping, mapping.convertedTypes[typeIndex]);
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

        return apply;
    }
);