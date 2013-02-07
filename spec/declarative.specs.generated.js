var __src_mappingModes = (function(module) {
var exports = module.exports;
exports.attribute = 'attribute';
exports.element = 'element';


return module.exports;

}({exports: {}}));
var __src_common_hyphenate = (function(module) {
var upperCaseRegex = new RegExp(/([A-Z])/g);

var hyphenate = function(input) {
    return input.replace(upperCaseRegex, function(completeMatch, character) {
        return '-' + character.toLowerCase();
    });
};

module.exports = hyphenate;
return module.exports;

}({exports: {}}));
var __src_errors = (function(module) {
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

}({exports: {}}));
var __src_dom_isDomElement = (function(module) {
var isDomElement = function(element) {
    return element &&
        (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
};

var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

module.exports = isDomElement;
return module.exports;

}({exports: {}}));
var __src_dom_generateCssSelectors = (function(module) {
var mappingModes = __src_mappingModes;

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

module.exports = generateCssSelectors;
return module.exports;

}({exports: {}}));
var __src_common_array = (function(module) {
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

module.exports = array;


return module.exports;

}({exports: {}}));
var __src_mapping_completeMapping = (function(module) {
var mappingModes = __src_mappingModes;

var completeMapping = function(mapping) {
    mapping.prefix = mapping.prefix || '';
    mapping.mappingMode = mapping.mappingMode || mappingModes.attribute;
    mapping.distinct = (mapping.distinct !== undefined) ? mapping.distinct : true;
};

module.exports = completeMapping;
return module.exports;

}({exports: {}}));
var __src_mapping_optimizeMapping = (function(module) {
var hyphenate = __src_common_hyphenate;

var optimizeMapping = function(mapping) {
    mapping.prefix = mapping.prefix.toLowerCase();
    mapping.convertedTypes = [];
    for (var i = 0, j = mapping.types.length; i < j; i++) {
        var hyphenatedType = hyphenate(mapping.types[i]);
        mapping.convertedTypes.push(mapping.prefix + hyphenatedType);
    }
};

module.exports = optimizeMapping;
return module.exports;

}({exports: {}}));
var __src_mapping_validateMapping = (function(module) {
var mappingModes = __src_mappingModes;
var errors = __src_errors;

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

module.exports = validateMapping;

return module.exports;

}({exports: {}}));
var __src_settings = (function(module) {
var exports = module.exports;
exports.mappingTimeoutMs = 1000;
exports.mappingWaitTimeMs = 20;
return module.exports;

}({exports: {}}));
var __src_common_parseOptions = (function(module) {
var errors = __src_errors;

var parseOptions = function(input) {
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

}({exports: {}}));
var __src_common_async = (function(module) {
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

module.exports = async;
return module.exports;

}({exports: {}}));
var __src_common_Deferred = (function(module) {
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

module.exports = Deferred;
return module.exports;

}({exports: {}}));
var __src_dom_getSpecifiedAttributes = (function(module) {
var errors = __src_errors;
var isDomElement = __src_dom_isDomElement;

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

module.exports = getSpecifiedAttributes;
return module.exports;

}({exports: {}}));
var __src_dom_getRelevantElements = (function(module) {
var generateCssSelectors = __src_dom_generateCssSelectors;
var mappingModes = __src_mappingModes;

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

module.exports = getRelevantElements;
return module.exports;

}({exports: {}}));
var __src_mapping_mappings = (function(module) {
var array = __src_common_array;
var validateMapping = __src_mapping_validateMapping;
var completeMapping = __src_mapping_completeMapping;
var optimizeMapping = __src_mapping_optimizeMapping;
var errors = __src_errors;

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

module.exports = mappings;


return module.exports;

}({exports: {}}));
var __src_mapping_apply = (function(module) {
var mappingModes = __src_mappingModes;
var errors = __src_errors;
var settings = __src_settings;
var array = __src_common_array;
var parseOptions = __src_common_parseOptions;
var async = __src_common_async;
var Deferred = __src_common_Deferred;
var isDomElement = __src_dom_isDomElement;
var getSpecifiedAttributes = __src_dom_getSpecifiedAttributes;
var getRelevantElements = __src_dom_getRelevantElements;
var mappings = __src_mapping_mappings;

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

module.exports = apply;
return module.exports;

}({exports: {}}));
var __src_mapping_applyAllMappings = (function(module) {
var mappings = __src_mapping_mappings;
var apply = __src_mapping_apply;

var applyAllMappings = function () {
    var ids = [], allMappings = mappings.getAll();
    for (var i = 0, j = allMappings.length; i < j; i++) {
        ids.push(allMappings[i].id);
    }
    return apply(ids);
};

module.exports = applyAllMappings;
return module.exports;

}({exports: {}}));
var __spec_common_array$spec = (function(module) {
describe('common/array', function() {

    var subject = __src_common_array;

    describe('isArray(value)', function() {

        it('should return true for an array', function() {

            expect(subject.isArray([])).toBeTruthy();

        });

        it('should return false for a number', function() {

            expect(subject.isArray(5)).toBeFalsy();

        });

        it('should return false for a string', function() {

            expect(subject.isArray('foobar')).toBeFalsy();

        });

        it('should return false for a jQuery object', function() {

            expect(subject.isArray($)).toBeFalsy();

        });

    });

    describe('ensureArray(value)', function() {

        it('should return the original array if an array is given', function() {

            var result = subject.ensureArray([1, 2, 3, 4, 5]);

            expect(subject.isArray(result)).toBeTruthy();
            expect(result.length).toBe(5);

        });

        it('should return an array of length 1 if a simple value is given', function() {

            var result = subject.ensureArray(1);

            expect(subject.isArray(result)).toBeTruthy();
            expect(result.length).toBe(1);

        });

    });

    describe('indexOf(array, value)', function() {

        it('should return the correct index if the value exists in the array', function() {

            var result = subject.indexOf([1, 2, 3, 4, 5], 1);

            expect(result).toBe(0);

        });

        it('should return the correct index if the value exists in the array but has not the same type', function() {

            var result = subject.indexOf([1, 2, 3, 4, 5], '1');

            expect(result).toBe(0);

        });

        it('should return the -1 if the value does not exist in the array', function() {

            var result = subject.indexOf([1, 2, 3, 4, 5], 10);

            expect(result).toBe(-1);

        });

    });

});
return module.exports;

}({exports: {}}));
var __spec_common_async$spec = (function(module) {
describe('common/async', function() {

    var async = __src_common_async;

    it('should call the given callback immediately once', function() {
        var spy = jasmine.createSpy('async');
        async(spy);

        expect(spy).toHaveBeenCalled();
    });

    it('should pass an "elapsed time" function as first argument to the callback', function() {
        async(function(elapsedTime) {
            expect(elapsedTime instanceof Function).toBeTruthy();
            expect(typeof elapsedTime()).toBe('number');
        });
    });

    it('should pass a "schedule next execution" function as second argument to the callback', function() {
        async(function(elapsedTime, scheduleNext) {
            expect(scheduleNext instanceof Function).toBeTruthy();
        });
    });


    it('should execute the callback again when another execution is scheduled (after given timeout)', function() {
        var callCount = 0;
        async(function(elapsedTime, scheduleNext) {
            callCount++;
            if (callCount == 1) {
                scheduleNext(100);
            }
        });
        expect(callCount).toBe(1);
        waitsFor(function() { return callCount == 2; });
        runs(function() { expect(callCount).toBe(2); });
    });

});
return module.exports;

}({exports: {}}));
var __spec_common_Deferred$spec = (function(module) {
describe('common/Deferred', function() {

    var Deferred = __src_common_Deferred;

    describe('resolving', function() {

        describe('calling resolve() after one then() call', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('success handler');

                deferred.then(spy);

                deferred.resolve(arg1, arg2, arg3);
            });

            it('should execute the success handler passed to then()', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all resolve() arguments on to the success handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling resolve() twice after one then() call', function() {

            it('should execute the success handler only once', function() {

                var deferred = new Deferred();
                var spy = jasmine.createSpy('success handler');

                deferred.then(spy);

                deferred.resolve();
                deferred.resolve();

                expect(spy.callCount).toBe(1);

            });

        });

        describe('calling resolve() after multiple separate then() calls', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.then(spy1);
                deferred.then(spy2);
                deferred.resolve();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling then() after resolve() was already called', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('success handler');

                deferred.resolve(arg1, arg2, arg3);
                deferred.then(spy);
            });

            it('should nevertheless execute the success handler', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all resolve() arguments on to the success handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling then() twice separately after resolve() was already called', function() {

            it('should nevertheless execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.resolve();
                deferred.then(spy1);
                deferred.then(spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling resolve() after calling then() in a chain', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.then(spy1).then(spy2);
                deferred.resolve();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

            it('should execute the error handler of a then() if the preceding success handler throws an error', function() {

                var deferred = new Deferred();
                var dummy = function() {};
                var error = new Error();
                var errorHandler = function() { throw error; };
                var spy = jasmine.createSpy('error handler');

                deferred.then(dummy).then(errorHandler).then(dummy, spy);
                deferred.resolve();

                expect(spy).toHaveBeenCalledWith(error);

            });

            it('should pass return values of preceding then() success handlers to the following success handlers', function() {

                var deferred = new Deferred();
                var args = {};
                var callback = function() {
                    return args;
                };
                var spy = jasmine.createSpy('success handler 2');

                deferred.then(callback).then(spy);
                deferred.resolve();

                expect(spy).toHaveBeenCalledWith(args);

            });

        });

        describe('calling then() in a chain after the first deferred was already resolved', function() {

            it('should execute all success handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('success handler 1');
                var spy2 = jasmine.createSpy('success handler 2');

                deferred.resolve();
                deferred.then(spy1).then(spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

    });

    describe('rejecting', function() {

        describe('calling reject() after one then() call', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('error handler');

                deferred.then(function() {}, spy);

                deferred.reject(arg1, arg2, arg3);
            });

            it('should execute the error handler passed to then()', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all reject() arguments on to the error handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling reject() twice after one then() call', function() {

            it('should execute the error handler only once', function() {

                var deferred = new Deferred();
                var spy = jasmine.createSpy('error handler');

                deferred.then(function() {}, spy);

                deferred.reject();
                deferred.reject();

                expect(spy.callCount).toBe(1);

            });

        });

        describe('calling reject() after multiple separate then() calls', function() {

            it('should execute all error handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('error handler 1');
                var spy2 = jasmine.createSpy('error handler 2');

                deferred.then(function(){}, spy1);
                deferred.then(function(){}, spy2);
                deferred.reject();

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

        describe('calling then() after reject() was already called', function() {

            var spy, arg1 = 1, arg2 = 2, arg3 = 3;

            beforeEach(function() {

                var deferred = new Deferred();
                spy = jasmine.createSpy('error handler');

                deferred.reject(arg1, arg2, arg3);

                deferred.then(function() {}, spy);
            });

            it('should nevertheless execute the error handler', function() {
                expect(spy).toHaveBeenCalled();
            });

            it('should pass all reject() arguments on to the error handler', function() {
                expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
            });

        });

        describe('calling then() twice separately after reject() was already called', function() {

            it('should nevertheless execute all error handlers', function() {

                var deferred = new Deferred();
                var spy1 = jasmine.createSpy('error handler 1');
                var spy2 = jasmine.createSpy('error handler 2');

                deferred.reject();
                deferred.then(function() {}, spy1);
                deferred.then(function() {}, spy2);

                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();

            });

        });

    });

});
return module.exports;

}({exports: {}}));
var __spec_common_hyphenate$spec = (function(module) {
describe('common/hyphenate', function() {

    var testMethod = __src_common_hyphenate;

    it('should return lowercase strings unmodified', function() {

        var input = 'lowercase';

        var result = testMethod(input);

        expect(result).toBe(input);

    });

    it('should replace uppercase characters with a lowercase counterpart preceeded by a hyphen', function() {

        var input = 'upperCaseText';

        var result = testMethod(input);

        expect(result).toBe('upper-case-text');

    });

    it('should replace an uppercase character even if it is the first one in the given string', function() {

        var input = 'Test';

        var result = testMethod(input);

        expect(result).toBe('-test');

    });

});
return module.exports;

}({exports: {}}));
var __spec_common_parseOptions$spec = (function(module) {
describe('common/parseOptions', function() {

    var testMethod = __src_common_parseOptions;

    it('should convert an empty string to an empty object', function() {

        var result = testMethod('');

        expect(typeof result).toBe('object');

    });

    it('should convert single quoted key and value separated by colon', function () {

        var result = testMethod("'key':'value'");
        expect(result.key).toBe('value');

    });

    it('should convert single quoted key and value separated by colon and whitespaces', function () {

        var result = testMethod("'key'   :   'value'");
        expect(result.key).toBe('value');

    });

    it('should throw an error if a string value has no quotes', function() {

        expect(function() {
            testMethod("'key':value");
        }).toThrow();

    });

    it('should not throw an error if a boolean value has no quotes', function() {

        expect(function() {
            testMethod("'key':true");
        }).not.toThrow();

    });

    it('should not throw an error if a number value has no quotes', function() {

        expect(function() {
            testMethod("'key':4");
        }).not.toThrow();

    });

    it('should convert key and value separated by colon even if the key has no quotes', function() {

        var result = testMethod("key:'value'");
        expect(result.key).toBe('value');

    });

    it('should convert key and value separated by colon and whitespaces even if the key has no quotes', function() {

        var result = testMethod("key    :    'value'");
        expect(result.key).toBe('value');

    });

    it('should convert key and value separated by colon even if the key contains a colon', function() {

        var result = testMethod("'k:ey':'value'");
        expect(result['k:ey']).toBe('value');

    });

    it('should convert key and value separated by colon even if the key contains a colon and a comma', function() {

        var result = testMethod("'k:ey,':'value'");
        expect(result['k:ey,']).toBe('value');

    });

    it('should convert a comma separated list of colon separated key value pairs', function() {

        var result = testMethod("'one':'one', 'two': 'two', 'three': 'three'");

        expect(result.one).toBe('one');
        expect(result.two).toBe('two');
        expect(result.three).toBe('three');

    });

    it('should convert a comma separated list of colon separated key value pairs even if all keys have no quotes', function() {

        var result = testMethod("one:'one', two: 'two', three:'three'");

        expect(result.one).toBe('one');
        expect(result.two).toBe('two');
        expect(result.three).toBe('three');

    });

    it('should convert a value containing a string array to an array property', function() {

        var result = testMethod("key: ['1', '2', '3']");

        expect(result.key.length).toBe(3);

    });

    it('should convert a value containing an object even if the nested object keys have no quotes', function() {

        var result = testMethod("key: {subKey: 1}");

        expect(result.key.subKey).toBe(1);

    });

    it('should convert a value containing an bool array to an array property', function() {

        var result = testMethod("key: [true, false, true]");

        expect(result.key.length).toBe(3);

    });

    it('should convert a value containing an number array to an array property', function() {

        var result = testMethod("key: [1, 2, 3]");

        expect(result.key.length).toBe(3);

    });

});
return module.exports;

}({exports: {}}));
var __spec_dom_generateCssSelectors$spec = (function(module) {
describe('dom/generateCssSelectors', function() {

    var testMethod = __src_dom_generateCssSelectors;
    var mappingModes = __src_mappingModes;

    it('should throw an error for an empty object', function() {

        expect(function() { testMethod({}); }).toThrow();

    });

    it('should return an empty string for an object containing empty mapping mode arrays', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('');

    });

    it('should return a singe element selector for one type in the element mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = ['type'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('type');

    });

    it('should return a single attribue selector for one type in the attribute mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type'];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type]');

    });

    it('should return multiple element selectors for mulitple types in the element mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = ['type1', 'type2'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('type1,type2');

    });

    it('should return multiple attribute selectors for mulitple types in the attribute mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type1', 'type2'];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type1],[type2]');

    });

    it('should return a combined selector list for mulitple types in both mapping modes', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type1', 'type2'];
        typesByMappingMode[mappingModes.element] = ['type3', 'type4'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type1],[type2],type3,type4');

    });

});
return module.exports;

}({exports: {}}));
var __spec_dom_getRelevantElements$spec = (function(module) {
describe('dom/getRelevantElements', function() {

    var testMethod = __src_dom_getRelevantElements;

    it('should request all elements if no query selectors are available', function() {

        var element = {getElementsByTagName: function() {}};
        spyOn(element, 'getElementsByTagName').andCallThrough();

        testMethod(element, []);

        expect(element.getElementsByTagName).toHaveBeenCalled();

    });

    it('should use query selectors if they are available', function() {

        var element = {querySelectorAll: function() {}};
        spyOn(element, 'querySelectorAll').andCallThrough();

        testMethod(element, []);

        expect(element.querySelectorAll).toHaveBeenCalled();

    });

});
return module.exports;

}({exports: {}}));
var __spec_dom_getSpecifiedAttributes$spec = (function(module) {
describe('dom/getSpecifiedAttributes', function() {

    var testMethod = __src_dom_getSpecifiedAttributes;
    var errors = __src_errors;

    it('should throw an error if not given a DOM element', function() {

        var element = {};

        expect(function() {
            testMethod(element);
        }).toThrow(errors.domElement);

    });

    it('should return an object if given a valid DOM element', function() {

        var element = document.createElement('element');

        var result = testMethod(element);

        expect(result).toBeDefined();

    });

    it('should return an object with all specified attribute keys and values of the DOM element', function() {

        var element = document.createElement('element');
        element.setAttribute('one', 'one');
        element.setAttribute('two', 'two');
        element.setAttribute('three', 'three');

        var result = testMethod(element);

        expect(result.one).toBe('one');
        expect(result.two).toBe('two');
        expect(result.three).toBe('three');

    });

    it('should not add any not specified attributes as properties to the result object', function() {

        var element = document.createElement('element');
        element.setAttribute('one', 'one');
        element.setAttribute('two', 'two');
        element.setAttribute('three', 'three');

        var result = testMethod(element);

        var countOfProperties = 0;
        for (var property in result) {
            if (result.hasOwnProperty(property)) {
                countOfProperties++;
            }
        }

        expect(countOfProperties).toBe(3);

    });


});
return module.exports;

}({exports: {}}));
var __spec_dom_isDOMElement$spec = (function(module) {
describe('dom/isDomElement', function() {

    var testMethod = __src_dom_isDomElement;

    it('should return false if given no element', function() {

        var result = testMethod();

        expect(result).toBeFalsy();

    });

    it('should return false if given an empty object', function() {

        var result = testMethod({});

        expect(result).toBeFalsy();

    });

    it('should return false if given a jquery selector result', function() {

        var result = testMethod($('<div></div>'));

        expect(result).toBeFalsy();

    });

    it('should return false if given a DOM attribute', function() {

        var attribute = document.createAttribute('something');

        var result = testMethod(attribute);

        expect(result).toBeFalsy();

    });

    it('should return true if given a DOM element', function() {

        var element = document.createElement('something');

        var result = testMethod(element);

        expect(result).toBeTruthy();

    });

    it('should return true if given the document element', function() {

        var result = testMethod(document);

        expect(result).toBeTruthy();

    });

});
return module.exports;

}({exports: {}}));
var __spec_mapping_apply$spec = (function(module) {
var mappingModes = __src_mappingModes;
var errors = __src_errors;
var apply = __src_mapping_apply;
var mappings = __src_mapping_mappings;
var Deferred = __src_common_Deferred;

var callbackSpy;

var createMapping = function (mappingMode) {
    return {
        id: 'some id',
        prefix: 'prefix-',
        types: ['type', 'hyphenatedType', 'uppercase'],
        convertedTypes: ['prefix-type', 'prefix-hyphenated-type', 'prefix-uppercase'],
        callback: callbackSpy,
        mappingMode: mappingMode
    };
};

var it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument = function(element) {
    it('should call the mapping callback with the DOM element as first argument', function() {
        runs(function() {
            expect(callbackSpy.argsForCall[0][0]).toBe(element);
        });
    });
};

var it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument = function(type) {
    it('should call the mapping callback with the the type identifier as second argument', function() {
        runs(function() {
            expect(callbackSpy.argsForCall[0][1]).toBe(type);
        });
    });
};

var it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument = function(property, value) {
    it('should call the mapping callback with the the parsed options as third argument', function() {
        runs(function() {
            if (property && value) {
                expect(callbackSpy.argsForCall[0][2][property]).toBe(value);
            }
            else {
                expect(callbackSpy.argsForCall[0][2]).toBeDefined();
            }
        });
    });
};

beforeEach(function() {
    mappings.clear();
});

describe('mapping/apply', function() {

    var testMethod = apply;

    describe('given a single mapping id for an existing mapping in the registry', function() {

        var result;

        beforeEach(function() {
            spyOn(mappings, 'get').andCallFake(function() {});
            result = testMethod('some id');
        });

        it('should look up the given id in the existing mappings', function() {
            expect(mappings.get).toHaveBeenCalled();
        });

        it('should return an object containing a function to(element)', function() {
            expect(typeof result.to).toBe('function');

        });

    });

    describe('given a single mapping with mapping mode "attribute"', function() {

        describe('declarative.apply(ids).to(element)', function() {

            beforeEach(function() {

                callbackSpy = jasmine.createSpy('apply.to.callback');

                spyOn(mappings, 'get').andCallFake(function() {
                    return createMapping(mappingModes.attribute);
                });

            });

            it('should throw an error if the passed object is not a DOM object', function() {
                expect(function() {
                    testMethod().to({});
                }).toThrow(errors.verifyDomElement);
            });

            it('should return a Deferred', function() {
                var div = document.createElement('div');
                expect(testMethod().to(div) instanceof Deferred).toBeTruthy();
            });

            describe('given an element with an attribute starting with the prefix and matching a type', function() {

                var element = $('<div prefix-type="option: \'value\'"></div>').get(0);

                beforeEach(function() {
                    waitsForDeferred(testMethod('some id').to(element));
                });

                it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument('option', 'value');

            });

            describe('given an element with an attribute without value starting with the prefix and matching a type', function() {

                var element = $('<div prefix-type></div>').get(0);

                beforeEach(function() {
                    waitsForDeferred(testMethod('some id').to(element));
                });

                it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument();

            });

            describe('given a parent containing a child with an attribute starting with the prefix and matching a type', function() {

                var parent = $('<div id="parent"></div>').get(0);
                var element = $('<div prefix-type="option: \'value\'"></div>').get(0);
                parent.appendChild(element);

                beforeEach(function() {
                    waitsForDeferred(testMethod('some id').to(parent));
                });

                it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument('option', 'value');

            });

            describe('given a hyphenated attribute starting with the prefix and matching a type when converted to camel case', function() {

                it('should call the callback with the correct type', function() {

                    var element = $('<div prefix-hyphenated-type="option: \'value\'"></div>').get(0);

                    waitsForDeferred(testMethod('some id').to(element));

                    runs(function() {
                        expect(callbackSpy.argsForCall[0][1]).toBe('hyphenatedType');
                    });

                });

            });

            describe('given an element with an uppercase attribute starting with the prefix and matching a lowercase type', function() {

                it('should call the callback with the correct type', function() {

                    var element = $('<div prefix-UPPERCASE="option: \'value\'"></div>').get(0);

                    waitsForDeferred(testMethod('some id').to(element));

                    runs(function() {
                        expect(callbackSpy.argsForCall[0][1]).toBe('uppercase');
                    });

                });

            });

        });

    });

    describe('given a single mapping with mapping mode "element"', function() {

        describe('declarative.apply(ids).to(element)', function() {

            beforeEach(function() {

                callbackSpy = jasmine.createSpy('apply.to.callback');

                spyOn(mappings, 'get').andCallFake(function() {
                    return createMapping(mappingModes.element);
                });

            });

            describe('given an element with a name starting with the prefix and matching a type', function() {

                var element = $('<prefix-type option="value"></prefix-type>').get(0);

                beforeEach(function() {
                    waitsForDeferred(testMethod('some id').to(element));
                });

                it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument('option', 'value');

            });

            describe('given a parent containing a child element with its name starting with the prefix and matching a type', function() {

                var parent = $('<div id="parent"></div>').get(0);
                var element = document.createElement('prefix-type');
                parent.appendChild(element);

                beforeEach(function() {
                    waitsForDeferred(testMethod('some id').to(parent));
                });

                it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument();

            });

            describe('given a hyphenated element starting with the prefix and matching a type when converted to camel case', function() {

                it('should call the callback with the correct type', function() {

                    var element = $('<prefix-hyphenated-type option="value"></prefix-hyphenated-type>').get(0);

                    waitsForDeferred(testMethod('some id').to(element));

                    runs(function() {
                        expect(callbackSpy.argsForCall[0][1]).toBe('hyphenatedType');
                    });
                });

            });

            describe('given an uppercase element starting with the prefix and matching a lowercase type', function() {

                it('should call the callback with the correct type', function() {

                    var element = $('<prefix-UPPERCASE option="value"></prefix-UPPERCASE>').get(0);

                    waitsForDeferred(testMethod('some id').to(element));

                    runs(function() {
                        expect(callbackSpy.argsForCall[0][1]).toBe('uppercase');
                    });
                });

            });

        });

    });

    describe('applying a single distinct mapping twice to the same element', function() {

        it('should call the callback only once', function() {

            var callbackSpy = jasmine.createSpy('apply.to.callback');
            var element = $('<div prefix-type="option: \'value\'"></div>').get(0);

            spyOn(mappings, 'get').andCallFake(function() {
                return {
                    id: 'some id',
                    prefix: 'prefix-',
                    types: ['type'],
                    convertedTypes: ['prefix-type'],
                    mappingMode: mappingModes.attribute,
                    callback: callbackSpy,
                    distinct: true
                };
            });

            waitsForDeferred(testMethod('some id').to(element));

            runs(function() {

                waitsForDeferred(testMethod('some id').to(element));

                runs(function() {
                    expect(callbackSpy.callCount).toBe(1);
                });

            });


        });

    });

    describe('applying a single non distinct mapping twice to the same element', function() {

        it('should call the callback twice', function() {

            var callbackSpy = jasmine.createSpy('apply.to.callback');
            var element = $('<div prefix-type="option: \'value\'"></div>').get(0);

            spyOn(mappings, 'get').andCallFake(function() {
                return {
                    id: 'some id',
                    prefix: 'prefix-',
                    types: ['type'],
                    convertedTypes: ['prefix-type'],
                    mappingMode: mappingModes.attribute,
                    callback: callbackSpy,
                    distinct: false
                };
            });

            waitsForDeferred(testMethod('some id').to(element));

            runs(function() {

                waitsForDeferred(testMethod('some id').to(element));

                runs(function() {
                    expect(callbackSpy.callCount).toBe(2);
                });

            });


        });

    });

});
return module.exports;

}({exports: {}}));
var __spec_mapping_applyAllMappings$spec = (function(module) {
describe('mapping/applyAllMappings', function() {

    var applyAllMappings = __src_mapping_applyAllMappings;
    var mappings = __src_mapping_mappings;

    var testMethod = applyAllMappings;
    var result;

    beforeEach(function() {
        mappings.clear();
        spyOn(mappings, 'getAll').andCallThrough();
        result = testMethod();
    });

    it('should request all mappings', function() {
        expect(mappings.getAll).toHaveBeenCalled();

    });

    it('should return an object containing a function to(element)', function() {
        expect(typeof result.to).toBe('function');
    });

});
return module.exports;

}({exports: {}}));
var __spec_mapping_completeMapping$spec = (function(module) {
describe('mapping/completeMapping', function() {

    var testMethod = __src_mapping_completeMapping;
    var mappingModes = __src_mappingModes;

    it('should add the mappingMode "attribute" if not given', function() {

        var mapping = {
            id: 'some id',
            types: ['calendar'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.mappingMode).toBe(mappingModes.attribute);

    });

    it('should not change the mappingMode if given', function() {

        var mapping = {
            id: 'some id',
            types: ['calendar'],
            mappingMode: 'element',
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.mappingMode).toBe('element');

    });

    it('should add the property "distinct" with a value of true if not given', function() {

        var mapping = {
            id: 'some id',
            types: ['calendar'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.distinct).toBeTruthy();

    });

    it('should not change the property "distinct" if given', function() {

        var mapping = {
            id: 'some id',
            types: ['calendar'],
            callback: function() {},
            distinct: false
        };

        testMethod(mapping);

        expect(mapping.distinct).toBeFalsy();

    });

    it('should add an empty string as prefix if the given mapping does not contain a prefix', function() {

        var mapping = {
            id: 'some id',
            types: ['calendar'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.prefix).toBe('');

    });


});
return module.exports;

}({exports: {}}));
var __spec_mapping_mappings$spec = (function(module) {
describe('mapping/mappings', function() {

    var subject = __src_mapping_mappings;
    var errors = __src_errors;

    beforeEach(function() {
        subject.clear();
    });

    describe('adding and requesting a single mapping', function() {

        it('should return the mapping with the given id if it was previously added to the registry', function() {

            subject.add({
                id: 'some id',
                prefix: 'data-',
                types: ['calendar'],
                callback: function() {}
            });

            var result = subject.get('some id');

            expect(result).toBeDefined();
            expect(result.prefix).toBe('data-');
            expect(result.types[0]).toBe('calendar');
            expect(typeof result.callback).toBe('function');

        });

        it('should throw an error if the requested mapping does not exist in the registry', function() {

            expect(function() {
                subject.get('some id');
            }).toThrow(errors.getSingleMapping);

        });

    });

    describe('adding and requesting two mappings', function() {

        it('should return both mappings with the given ids if they were previously added to the registry', function() {

            subject.add({
                id: 'some id',
                prefix: 'data-',
                types: ['calendar'],
                callback: function() {}
            });

            subject.add({
                id: 'some other id',
                prefix: 'data-',
                types: ['calendar'],
                callback: function() {}
            });

            var result = subject.get(['some id', 'some other id']);

            expect(result).toBeDefined();
            expect(result.length).toBe(2);

        });

        it('should throw an error if one of the requested mappings does not exist in the registry', function() {

            subject.add({
                id: 'some id',
                prefix: 'data-',
                types: ['calendar'],
                callback: function() {}
            });

            expect(function() {
                subject.get(['some id', 'some other id']);
            }).toThrow(errors.getSingleMapping);

        });

    });

});

describe('mappings.getAll', function() {

    var subject = __src_mapping_mappings;

    beforeEach(function() {
        subject.clear();
    });

    it('should return a list of all mappings', function() {

        subject.add({
            id: '1',
            types: ['type'],
            callback: function() {}
        });
        subject.add({
            id: '2',
            types: ['type'],
            callback: function() {}
        });
        subject.add({
            id: '3',
            types: ['type'],
            callback: function() {}
        });
        subject.add({
            id: '4',
            types: ['type'],
            callback: function() {}
        });
        subject.add({
            id: '5',
            types: ['type'],
            callback: function() {}
        });

        var result = subject.getAll();

        expect(result.length).toBe(5);

    });

});
return module.exports;

}({exports: {}}));
var __spec_mapping_optimizeMapping$spec = (function(module) {
describe('mapping/optimizeMapping', function() {

    var testMethod = __src_mapping_optimizeMapping;

    it('should transform the prefix of the given mapping to lowercase', function() {

        var mapping = {
            id: 'some id',
            prefix: 'someMixedCase',
            types: ['calendar'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.prefix).toBe('somemixedcase');

    });

    it('should have added a convertedTypes object which contains all types combined with the prefix', function() {

        var mapping = {
            id: 'some id',
            prefix: 'prefix-',
            types: ['calendar', 'counter'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.convertedTypes).toBeDefined();
        expect(mapping.convertedTypes[0]).toBe('prefix-calendar');
        expect(mapping.convertedTypes[1]).toBe('prefix-counter');

    });

    it('should have transformed all camel case types to hyphenated string in the convertedTypes array', function() {

        var mapping = {
            id: 'some id',
            prefix: 'prefix-',
            types: ['someCasing', 'hereAlso'],
            callback: function() {}
        };

        testMethod(mapping);

        expect(mapping.convertedTypes).toBeDefined();
        expect(mapping.convertedTypes[0]).toContain('some-casing');
        expect(mapping.convertedTypes[1]).toContain('here-also');

    });

});
return module.exports;

}({exports: {}}));
var __spec_mapping_validateMapping$spec = (function(module) {
describe('mapping/validateMapping', function() {

    var testMethod = __src_mapping_validateMapping;
    var errors = __src_errors;

    it('should throw an error if the mapping is undefined', function() {

        expect(function() {
            testMethod();
        }).toThrow(errors.validateMapping);

    });

    it('should throw an error if the mapping contains no id property', function() {

        expect(function() {
            testMethod({});
        }).toThrow(errors.validateMappingId);

    });

    it('should throw an error if the mapping contains no types', function() {

        expect(function() {
            testMethod({
                id: 'some id'
            });
        }).toThrow(errors.validateMappingTypes);

    });

    it('should throw an error if the passed in types is not an array', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                types: 'foobar'
            });
        }).toThrow(errors.validateMappingTypesFormat);

    });

    it('should throw an error if the mapping contains no callback', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                prefix: 'data-',
                types: ['foo', 'bar']
            });
        }).toThrow(errors.validateMappingCallback);

    });

    it('should throw an error if the mappings contains an invalid mappingMode property"', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                types: ['foo', 'bar'],
                mappingMode: 'foobar',
                callback: function() {}
            });
        }).toThrow(errors.validateMappingMode);

    });

    it('should not throw an error if the mapping contains an id, a types array and a callback', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                types: ['foo', 'bar'],
                callback: function() {}
            });
        }).not.toThrow();

    });

    it('should not throw an error if the mapping contains a mappingMode property of "attribute"', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                types: ['foo', 'bar'],
                mappingMode: 'attribute',
                callback: function() {}
            });
        }).not.toThrow();

    });

    it('should not throw an error if the mapping contains a mappingMode property of "element"', function() {

        expect(function() {
            testMethod({
                id: 'some id',
                types: ['foo', 'bar'],
                mappingMode: 'element',
                callback: function() {}
            });
        }).not.toThrow();

    });

});
return module.exports;

}({exports: {}}));
var __spec_index$spec = (function(module) {
__spec_common_array$spec;
__spec_common_async$spec;
__spec_common_Deferred$spec;
__spec_common_hyphenate$spec;
__spec_common_parseOptions$spec;
__spec_dom_generateCssSelectors$spec;
__spec_dom_getRelevantElements$spec;
__spec_dom_getSpecifiedAttributes$spec;
__spec_dom_isDOMElement$spec;
__spec_mapping_apply$spec;
__spec_mapping_applyAllMappings$spec;
__spec_mapping_completeMapping$spec;
__spec_mapping_mappings$spec;
__spec_mapping_optimizeMapping$spec;
__spec_mapping_validateMapping$spec;
return module.exports;

}({exports: {}}));
