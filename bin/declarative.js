/**
 * @license
 * declarative - Mapper for custom user interface markup - version 1.3.7
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

        function define(a,b,c){define[a]=require(c?b:[],c||b)}function require(a,b,c,i){c=[];for(i in a)c[i]=define[a[i]];return b.apply(0,c)}
define('settings', function() {
    return {
        mappingTimeoutMs: 1000,
        mappingWaitTimeMs: 20
    };
});
define('errors', function() {

    var errors = {};
    errors.parseOptions = 'declarative: Error parsing options';
    errors.verifyDomElement = 'declarative: Invalid DOM element given';
    errors.getSingleMapping = 'declarative: Mapping id not existing';
    errors.validateMapping = 'declarative: Invalid mapping options';
    errors.validateMappingId = 'declarative: Invalid mapping id';
    errors.validateMappingTypes = 'declarative: Missing mapping types';
    errors.validateMappingTypesFormat = 'declarative: Invalid mapping types';
    errors.validateMappingCallback = 'declarative: Invalid mapping callback';
    errors.validateMappingMode = 'declarative: Invalid mappingMode';

    return errors;

});
define('mappingModes', function() {

    var mappingModes = {
        attribute: 'attribute',
        element: 'element'
    };

    return mappingModes;

});


define('common/array', function() {
    var array = {};

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

    return array;
});


define('common/async', function() {

    var async = function(callback) {

        var lastStart;

        var setStartAndExecuteCallback = function() {
            lastStart = new Date().getTime();
            callback(elapsedTime, scheduleNext);
        };

        var elapsedTime = function() {
            return (new Date()).getTime() - lastStart;
        };

        var scheduleNext = function(timeout) {
            setTimeout(setStartAndExecuteCallback, timeout);
        };

        setStartAndExecuteCallback();

    };

    return async;

});
define('common/Deferred', function() {

    var Deferred = function() {

        if (!(this instanceof Deferred)) { return new Deferred(); }

        var status = null, resolved = 'resolved', rejected = 'rejected';
        var resolveArguments, rejectArguments;
        var successHandlers = [], errorHandlers = [];

        this.then = function(successHandler, errorHandler) {
            var child = new Deferred();

            errorHandler = errorHandler || function() {};
            successHandler = successHandler || function() {};
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

        this.resolve = function() {
            if (!status) {
                resolveArguments = arguments;
                executeHandlers(this, successHandlers, resolveArguments);
                status = resolved;
            }
        };

        this.reject = function() {
            if (!status) {
                rejectArguments = arguments;
                executeHandlers(this, errorHandlers, rejectArguments);
                status = rejected;
            }
        };

    };

    var executeHandlers = function(scope, handlers, args) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            handlers[i].apply(scope, args);
        }
    };

    var chainSuccessHandler = function(scope, handler, deferred) {
        return function() {
            try {
                deferred.resolve(handler.apply(scope, arguments));
            }
            catch (error) {
                deferred.reject(error);
            }
        };
    };

    return Deferred;

});
define('common/hyphenate', function(){

    var upperCaseRegex = new RegExp(/([A-Z])/g);

    var hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    return hyphenate;

});
define('common/parseOptions', ['errors'], function(errors) {

    var parseOptions = function(input) {
        try {
            var output;
            return eval('output = {' + input + '}');
        }
        catch (error) {
            throw new Error(errors.parseOptions);
        }
    };

    return parseOptions;

});
define('dom/generateCssSelectors', ['mappingModes'], function(mappingModes) {

    var generateCssSelectors = function(typesByMappingMode) {
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

    return generateCssSelectors;

});
define('dom/getRelevantElements',
    ['dom/generateCssSelectors', 'mappingModes'],
    function(generateCssSelectors, mappingModes) {

        var getRelevantElements = function(element, mappings) {
            if (element.querySelectorAll) {
                return getRelevantElementsByCssSelectors(element, mappings);
            }
            return element.all ? element.all : element.getElementsByTagName('*');
        };

        var getRelevantElementsByCssSelectors = function(element, mappings) {
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

        return getRelevantElements;

    }
);
define('dom/getSpecifiedAttributes', ['errors', 'dom/isDomElement'], function(errors, isDomElement) {

    var getSpecifiedAttributes = function(element) {
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
        if (!isDomElement(element)) {
            throw new Error(errors.verifyDomElement);
        }
    };

    return getSpecifiedAttributes;

});
define('dom/isDomElement', function() {

    var isDomElement = function(element) {
        return element &&
            (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
    };

    var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

    return isDomElement;

});
define('mapping/validateMapping', ['mappingModes', 'errors'], function(mappingModes, errors) {

    var validateMapping = function(mapping) {
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

    var generateError = function(message) {
        throw new Error(message);
    };

    return validateMapping;

});
define('mapping/completeMapping', ['mappingModes'], function(mappingModes) {

    var completeMapping = function(mapping) {
        mapping.prefix = mapping.prefix || '';
        mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
        mapping.distinct = (mapping.distinct !== undefined) ? mapping.distinct : true;
    };

    return completeMapping;

});
define('mapping/optimizeMapping', ['common/hyphenate'], function(hyphenate) {

    var optimizeMapping = function(mapping) {
        mapping.prefix = mapping.prefix.toLowerCase();
        mapping.convertedTypes = [];
        for (var i = 0, j = mapping.types.length; i < j; i++) {
            var hyphenatedType = hyphenate(mapping.types[i]);
            mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
        }
    };

    return optimizeMapping;

});
define('mapping/mappings',
    ['common/array', 'errors', 'mapping/validateMapping', 'mapping/completeMapping', 'mapping/optimizeMapping'],
    function(array, errors, validateMapping, completeMapping, optimizeMapping) {

    var mappings = {};

    mappings.clear = function() {
        registeredMappings = {};
    };

    mappings.add = function(newMappings) {
        newMappings = array.ensureArray(newMappings);
        for (var i = 0, j = newMappings.length; i < j; i++) {
            var mapping = newMappings[i];
            validateMapping(mapping);
            completeMapping(mapping);
            optimizeMapping(mapping);
            registeredMappings[mapping.id] = mapping;
        }
    };

    mappings.getAll = function() {
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

    var getSingleMapping = function(id) {
        return registeredMappings[id] || throwNewError();
    };

    var throwNewError = function() {
        throw new Error(errors.getSingleMapping);
    };

    var registeredMappings = {};

    return mappings;

});


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
define('mapping/applyAllMappings',
    ['mapping/mappings', 'mapping/apply'],
    function(mappings, apply) {

        return function () {
            var ids = [], allMappings = mappings.getAll();
            for (var i = 0, j = allMappings.length; i < j; i++) {
                ids.push(allMappings[i].id);
            }
            return apply(ids);
        };

    }
);
var declarative = {};
require(
    ['mappingModes', 'mapping/mappings', 'mapping/apply', 'mapping/applyAllMappings', 'settings'],
    function(mappingModes, mappings, apply, applyAllMappings, settings) {
        declarative.mappingModes = mappingModes;
        declarative.mappings = mappings;
        declarative.apply = apply;
        declarative.applyAllMappings = applyAllMappings;
        declarative.settings = settings;
    }
);
declarative.version = "1.3.7";

        return declarative;

    }));