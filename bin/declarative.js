/**
 * @license
 * declarative - Mapper for custom user interface markup - version 1.3.8
 * Copyright 2012, Alex Lawrence
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */

(function (root, factory) {

    if (typeof exports === 'object') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        root.declarative = factory();
    }

}(this, function () {

    var __mappingModes = (function (module) {
        var exports = module.exports;
        exports.attribute = 'attribute';
        exports.element = 'element';


        return module.exports;

    }({exports:{}}));
    var __errors = (function (module) {
        var exports = module.exports;
        exports.parseOptions = 'declarative: Error parsing options';
        exports.verifyDomElement = 'declarative: Invalid DOM element given';
        exports.getSingleMapping = 'declarative: Mapping id not existing';
        exports.validateMapping = 'declarative: Invalid mapping options';
        exports.validateMappingId = 'declarative: Invalid mapping id';
        exports.validateMappingTypes = 'declarative: Missing mapping types';
        exports.validateMappingTypesFormat = 'declarative: Invalid mapping types';
        exports.validateMappingCallback = 'declarative: Invalid mapping callback';
        exports.validateMappingMode = 'declarative: Invalid mappingMode';

        return module.exports;

    }({exports:{}}));
    var __common_hyphenate = (function (module) {
        var upperCaseRegex = new RegExp(/([A-Z])/g);

        var hyphenate = function (input) {
            return input.replace(upperCaseRegex, function (completeMatch, character) {
                return '-' + character.toLowerCase();
            });
        };

        module.exports = hyphenate;
        return module.exports;

    }({exports:{}}));
    var __mapping_validateMapping = (function (module) {
        var mappingModes = __mappingModes;
        var errors = __errors;

        var validateMapping = function (mapping) {
            if (!mapping) {
                generateError(errors.validateMapping);
            }
            if (!mapping.id) {
                generateError(errors.validateMappingId);
            }
            if (!mapping.types) {
                generateError(errors.validateMappingTypes);
            }
            if (mapping.types && !mapping.types.push) {
                generateError(errors.validateMappingTypesFormat);
            }
            if (!mapping.callback || typeof mapping.callback !== 'function') {
                generateError(errors.validateMappingCallback);
            }
            if (mapping.mappingMode && mapping.mappingMode !== mappingModes.attribute &&
                mapping.mappingMode !== mappingModes.element) {
                generateError(errors.validateMappingMode);
            }
        };

        var generateError = function (message) {
            throw new Error(message);
        };

        module.exports = validateMapping;

        return module.exports;

    }({exports:{}}));
    var __mapping_completeMapping = (function (module) {
        var mappingModes = __mappingModes;

        var completeMapping = function (mapping) {
            mapping.prefix = mapping.prefix || '';
            mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
            mapping.distinct = (mapping.distinct !== undefined) ? mapping.distinct : true;
        };

        module.exports = completeMapping;
        return module.exports;

    }({exports:{}}));
    var __mapping_optimizeMapping = (function (module) {
        var hyphenate = __common_hyphenate;

        var optimizeMapping = function (mapping) {
            mapping.prefix = mapping.prefix.toLowerCase();
            mapping.convertedTypes = [];
            for (var i = 0, j = mapping.types.length; i < j; i++) {
                var hyphenatedType = hyphenate(mapping.types[i]);
                mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
            }
        };

        module.exports = optimizeMapping;
        return module.exports;

    }({exports:{}}));
    var __common_array = (function (module) {
        var array = {};

        array.ensureArray = function (value) {
            return array.isArray(value) ? value : [value];
        };

        array.isArray = function (value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        };

        array.indexOf = function (haystack, needle) {
            for (var i = 0, j = haystack.length; i < j; i++) {
                if (haystack[i] == needle) {
                    return i;
                }
            }
            return -1;
        };

        module.exports = array;


        return module.exports;

    }({exports:{}}));
    var __dom_isDomElement = (function (module) {
        var isDomElement = function (element) {
            return element &&
                (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
        };

        var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

        module.exports = isDomElement;
        return module.exports;

    }({exports:{}}));
    var __dom_generateCssSelectors = (function (module) {
        var mappingModes = __mappingModes;

        var generateCssSelectors = function (typesByMappingMode) {
            var attributeSelectors = generateAttributeSelectors(typesByMappingMode[mappingModes.attribute]);
            var elementSelectors = generateElementSelectors(typesByMappingMode[mappingModes.element]);
            return combineSelectors(attributeSelectors, elementSelectors);
        };

        var generateAttributeSelectors = function (attributes) {
            var attributeSelectors = attributes.join('],[');
            if (attributeSelectors) {
                attributeSelectors = '[' + attributeSelectors + ']';
            }
            return attributeSelectors;
        };

        var generateElementSelectors = function (elements) {
            return elements.join(',');
        };

        var combineSelectors = function (left, right) {
            return left + (left && right ? ',' : '') + right;
        };

        module.exports = generateCssSelectors;
        return module.exports;

    }({exports:{}}));
    var __mapping_mappings = (function (module) {
        var array = __common_array;
        var validateMapping = __mapping_validateMapping;
        var completeMapping = __mapping_completeMapping;
        var optimizeMapping = __mapping_optimizeMapping;
        var errors = __errors;

        var mappings = {};

        mappings.clear = function () {
            registeredMappings = {};
        };

        mappings.add = function (newMappings) {
            newMappings = array.ensureArray(newMappings);
            for (var i = 0, j = newMappings.length; i < j; i++) {
                var mapping = newMappings[i];
                validateMapping(mapping);
                completeMapping(mapping);
                optimizeMapping(mapping);
                registeredMappings[mapping.id] = mapping;
            }
        };

        mappings.getAll = function () {
            var mappingsList = [];
            for (var property in registeredMappings) {
                if (registeredMappings.hasOwnProperty(property)) {
                    mappingsList.push(registeredMappings[property]);
                }
            }
            return mappingsList;
        };

        mappings.get = function (ids) {
            if (!array.isArray(ids)) {
                return getSingleMapping(ids);
            }
            var matches = [];
            for (var i = 0, j = ids.length; i < j; i++) {
                matches.push(getSingleMapping(ids[i]));
            }
            return matches;
        };

        var getSingleMapping = function (id) {
            return registeredMappings[id] || throwNewError();
        };

        var throwNewError = function () {
            throw new Error(errors.getSingleMapping);
        };

        var registeredMappings = {};

        module.exports = mappings;


        return module.exports;

    }({exports:{}}));
    var __settings = (function (module) {
        var exports = module.exports;
        exports.mappingTimeoutMs = 1000;
        exports.mappingWaitTimeMs = 20;
        return module.exports;

    }({exports:{}}));
    var __common_parseOptions = (function (module) {
        var errors = __errors;

        var parseOptions = function (input) {
            try {
                var output;
                return eval('output = {' + input + '}');
            }
            catch (error) {
                throw new Error(errors.parseOptions);
            }
        };

        module.exports = parseOptions;
        return module.exports;

    }({exports:{}}));
    var __common_async = (function (module) {
        var async = function (callback) {

            var lastStart;

            var setStartAndExecuteCallback = function () {
                lastStart = new Date().getTime();
                callback(elapsedTime, scheduleNext);
            };

            var elapsedTime = function () {
                return (new Date()).getTime() - lastStart;
            };

            var scheduleNext = function (timeout) {
                setTimeout(setStartAndExecuteCallback, timeout);
            };

            setStartAndExecuteCallback();

        };

        module.exports = async;
        return module.exports;

    }({exports:{}}));
    var __common_Deferred = (function (module) {
        var Deferred = function () {

            if (!(this instanceof Deferred)) {
                return new Deferred();
            }

            var status = null, resolved = 'resolved', rejected = 'rejected';
            var resolveArguments, rejectArguments;
            var successHandlers = [], errorHandlers = [];

            this.then = function (successHandler, errorHandler) {
                var child = new Deferred();

                errorHandler = errorHandler || function () {
                };
                successHandler = successHandler || function () {
                };
                successHandler = chainSuccessHandler(this, successHandler, child);

                if (status == resolved) {
                    successHandler.apply(this, resolveArguments);
                }
                if (status == rejected) {
                    errorHandler.apply(this, rejectArguments);
                }

                successHandlers.push(successHandler);
                errorHandlers.push(errorHandler);

                return child;
            };

            this.resolve = function () {
                if (!status) {
                    resolveArguments = arguments;
                    executeHandlers(this, successHandlers, resolveArguments);
                    status = resolved;
                }
            };

            this.reject = function () {
                if (!status) {
                    rejectArguments = arguments;
                    executeHandlers(this, errorHandlers, rejectArguments);
                    status = rejected;
                }
            };

        };

        var executeHandlers = function (scope, handlers, args) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                handlers[i].apply(scope, args);
            }
        };

        var chainSuccessHandler = function (scope, handler, deferred) {
            return function () {
                try {
                    deferred.resolve(handler.apply(scope, arguments));
                }
                catch (error) {
                    deferred.reject(error);
                }
            };
        };

        module.exports = Deferred;
        return module.exports;

    }({exports:{}}));
    var __dom_getSpecifiedAttributes = (function (module) {
        var errors = __errors;
        var isDomElement = __dom_isDomElement;

        var getSpecifiedAttributes = function (element) {
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

        var verifyDOMElement = function (element) {
            if (!isDomElement(element)) {
                throw new Error(errors.verifyDomElement);
            }
        };

        module.exports = getSpecifiedAttributes;
        return module.exports;

    }({exports:{}}));
    var __dom_getRelevantElements = (function (module) {
        var generateCssSelectors = __dom_generateCssSelectors;
        var mappingModes = __mappingModes;

        var getRelevantElements = function (element, mappings) {
            if (element.querySelectorAll) {
                return getRelevantElementsByCssSelectors(element, mappings);
            }
            return element.all ? element.all : element.getElementsByTagName('*');
        };

        var getRelevantElementsByCssSelectors = function (element, mappings) {
            var typesByMappingMode = {};
            typesByMappingMode[mappingModes.attribute] = [];
            typesByMappingMode[mappingModes.element] = [];
            for (var i = 0, j = mappings.length; i < j; i++) {
                var mapping = mappings[i], mappingMode = mapping.mappingMode;
                typesByMappingMode[mappingMode] =
                    typesByMappingMode[mappingMode].concat(mapping.convertedTypes);
            }
            var selector = generateCssSelectors(typesByMappingMode);
            return element.querySelectorAll(selector);
        };

        module.exports = getRelevantElements;
        return module.exports;

    }({exports:{}}));
    var __mapping_apply = (function (module) {
        var mappingModes = __mappingModes;
        var errors = __errors;
        var settings = __settings;
        var array = __common_array;
        var parseOptions = __common_parseOptions;
        var async = __common_async;
        var Deferred = __common_Deferred;
        var isDomElement = __dom_isDomElement;
        var getSpecifiedAttributes = __dom_getSpecifiedAttributes;
        var getRelevantElements = __dom_getRelevantElements;
        var mappings = __mapping_mappings;

        var apply = function (ids) {
            var mappingsToApply = mappings.get(ids);
            mappingsToApply = array.ensureArray(mappingsToApply);
            return applyMappingsToWrapper(mappingsToApply);
        };

        var applyMappingsToWrapper = function (mappings) {
            return {
                to:function (element) {
                    return applyMappingsTo(mappings, element);
                }
            };
        };

        var applyMappingsTo = function (mappings, rootElement) {
            verifyDomElement(rootElement);
            var allElements = getRelevantElements(rootElement, mappings);
            var mapping, attributes, elementIndex = allElements.length;
            var element = rootElement != document ? rootElement : allElements[--elementIndex];
            var mappingIndex = 0, j = mappings.length, typeIndex = 0, m = 0;
            var deferred = new Deferred();

            async(function (elapsedTime, scheduleNext) {
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

        var verifyDomElement = function (element) {
            if (!isDomElement(element)) {
                throw new Error(errors.verifyDomElement);
            }
        };

        var elementShouldNotBeMapped = function (mapping, element, type) {
            var id = element.getAttribute(idAttributeName);
            return mapping.distinct && (id > 0) && array.indexOf(appliedMappings[id], type) > -1;
        };

        var applyAttributeMapping = function (element, mapping, typeIndex) {
            var attribute = element.getAttributeNode(mapping.convertedTypes[typeIndex]);
            if (attribute && attribute.specified) {
                var options = parseOptions(attribute.nodeValue);
                mapping.callback(element, mapping.types[typeIndex], options);
                saveAppliedMappingInfo(element, mapping, mapping.convertedTypes[typeIndex]);
            }
        };

        var applyElementMapping = function (element, mapping, typeIndex) {
            if (element.nodeName.toLowerCase() == mapping.convertedTypes[typeIndex]) {
                var options = getSpecifiedAttributes(element);
                mapping.callback(element, mapping.types[typeIndex], options);
                saveAppliedMappingInfo(element, mapping, mapping.convertedTypes[typeIndex]);
            }
        };

        var saveAppliedMappingInfo = function (element, mapping, type) {
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

        module.exports = apply;
        return module.exports;

    }({exports:{}}));
    var __mapping_applyAllMappings = (function (module) {
        var mappings = __mapping_mappings;
        var apply = __mapping_apply;

        var applyAllMappings = function () {
            var ids = [], allMappings = mappings.getAll();
            for (var i = 0, j = allMappings.length; i < j; i++) {
                ids.push(allMappings[i].id);
            }
            return apply(ids);
        };

        module.exports = applyAllMappings;
        return module.exports;

    }({exports:{}}));
    var __index = (function (module) {
        var exports = module.exports;
        exports.mappingModes = __mappingModes;
        exports.mappings = __mapping_mappings;
        exports.applyAllMappings = __mapping_applyAllMappings;
        exports.settings = __settings;
        exports.apply = __mapping_apply;

        return module.exports;

    }({exports:{}}));

    return __index;

}));