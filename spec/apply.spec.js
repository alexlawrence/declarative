describe('declarative.apply', function() {

    var originalMappingsGet = declarative.mappings.get;
    var originalMappingsGetAll = declarative.mappings.getAll;
    var originalParseOptions = internal.parseOptions;
    var originalGetSpecifiedAttributes = internal.getSpecifiedAttributes;
    var parseOptionsSpy;
    var getSpecifiedAttributesSpy;

    beforeEach(function() {
        parseOptionsSpy = jasmine.createSpy('parseOptions');
        getSpecifiedAttributesSpy = jasmine.createSpy('getSpecifiedAttributes');
        internal.parseOptions = parseOptionsSpy;
        internal.getSpecifiedAttributes = getSpecifiedAttributesSpy;
    });

    afterEach(function() {
        declarative.mappings.get = originalMappingsGet;
        declarative.mappings.getAll = originalMappingsGetAll;
        internal.parseOptions = originalParseOptions;
        internal.getSpecifiedAttributes = originalGetSpecifiedAttributes;
    });

    describe('declarative.applyAllMappings', function() {

        var testMethod = declarative.applyAllMappings;

        it('should request all mappings', function() {

            var spy = jasmine.createSpy('mappings.getAll');
            declarative.mappings.getAll = spy;

            testMethod();

            expect(spy).toHaveBeenCalled();

        });

        it('should return an object containing a function to(element)', function() {

            declarative.mappings.get = function() {
                return {};
            };

            var subject = testMethod();
            expect(typeof subject.to).toBe('function');

        });

    });

    describe('declarative.apply(ids)', function() {

        var testMethod = declarative.apply;

        describe('given a single mapping id for an existing mapping in the registry', function() {

            it('should look up the given id in the existing mappings', function() {

                var spy = jasmine.createSpy('mappings.get');
                declarative.mappings.get = spy;

                testMethod('some id');

                expect(spy).toHaveBeenCalled();

            });

            it('should return an object containing a function to(element)', function() {

                declarative.mappings.get = function() {
                    return {};
                };

                var subject = testMethod('some id');
                expect(typeof subject.to).toBe('function');

            });

        });

        describe('given a single mapping with mapping mode "attribute"', function() {

            describe('declarative.apply(ids).to(element)', function() {

                var callbackSpy;

                beforeEach(function() {

                    callbackSpy = jasmine.createSpy('apply.to.callback');

                    declarative.mappings.get = function() {
                        return {
                            id: 'some id',
                            prefix: 'data-prefix-',
                            types: ['type', 'hyphenatedType', 'uppercase'],
                            convertedTypes: ['data-prefix-type', 'data-prefix-hyphenated-type', 'data-prefix-uppercase'],
                            callback: callbackSpy,
                            mappingMode: 'attribute'
                        };
                    };

                });

                it('should throw an error if the passed object is not a DOM object', function() {

                    declarative.mappings.get = function() {
                        return {};
                    };

                    var subject = testMethod('foobar');
                    expect(function() {
                        subject.to({});
                    }).toThrow('declarative.apply.to: invalid element (DOM object required)');

                });

                describe('given an element with an attribute starting with the prefix and matching a type', function() {

                    var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);

                    it('should call parseOptions with the value of the attribute', function() {

                        testMethod('some id').to(element);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        internal.parseOptions = function() {
                            return options;
                        };
                        testMethod('some id').to(element);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given an element with an attribute without value starting with the prefix and matching a type', function() {

                    var element = $('<div data-prefix-type></div>').get(0);

                    it('should call parseOptions with the value of the attribute', function() {

                        testMethod('some id').to(element);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {};
                        internal.parseOptions = function() {
                            return options;
                        };
                        testMethod('some id').to(element);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given a parent containing a child with an attribute starting with the prefix and matching a type', function() {

                    var parent = $('<div id="parent"></div>').get(0);
                    var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);
                    parent.appendChild(element);

                    it('should call parseOptions with the value of the attribute', function() {

                        testMethod('some id').to(parent);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        internal.parseOptions = function() {
                            return options;
                        };
                        testMethod('some id').to(parent);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given a hyphenated attribute starting with the prefix and matching a type when converted to camel case', function() {

                    it('should call the callback with the correct type', function() {

                        var element = $('<div data-prefix-hyphenated-type="option: \'value\'"></div>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        internal.parseOptions = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('hyphenatedType');

                    });

                });

                describe('given an element with an uppercase attribute starting with the prefix and matching a lowercase type', function() {

                    it('should call the callback with the correct type', function() {

                        var element = $('<div data-prefix-UPPERCASE="option: \'value\'"></div>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        internal.parseOptions = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('uppercase');

                    });

                });

            });

        });

        describe('given a single mapping with mapping mode "element"', function() {

            describe('declarative.apply(ids).to(element)', function() {

                var callbackSpy;

                beforeEach(function() {

                    callbackSpy = jasmine.createSpy('apply.to.callback');

                    declarative.mappings.get = function() {
                        return {
                            id: 'some id',
                            prefix: 'prefix-',
                            types: ['type', 'hyphenatedType', 'uppercase'],
                            convertedTypes: ['prefix-type', 'prefix-hyphenated-type', 'prefix-uppercase'],
                            callback: callbackSpy,
                            mappingMode: 'element'
                        };
                    };

                });


                it('should throw an error if the passed object is not a DOM object', function() {

                    declarative.mappings.get = function() {
                        return {};
                    };

                    var subject = testMethod('foobar');
                    expect(function() {
                        subject.to({});
                    }).toThrow('declarative.apply.to: invalid element (DOM object required)');

                });

                describe('given an element with a name starting with the prefix and matching a type', function() {

                    var element = $('<prefix-type option="value"></prefix-type>').get(0);

                    it('should call getSpecifiedAttributes passing in the the element', function() {

                        testMethod('some id').to(element);
                        expect(getSpecifiedAttributesSpy).toHaveBeenCalledWith(element);

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        internal.getSpecifiedAttributes = function() {
                            return options;
                        };
                        testMethod('some id').to(element);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given a parent containing a child element with its name starting with the prefix and matching a type', function() {

                    var parent = $('<div id="parent"></div>').get(0);
                    var element = document.createElement('prefix-type');
                    parent.appendChild(element);

                    it('should call getSpecifiedAttributes with the value of the attribute', function() {

                        testMethod('some id').to(parent);
                        expect(getSpecifiedAttributesSpy).toHaveBeenCalledWith(element);

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        internal.getSpecifiedAttributes = function() {
                            return options;
                        };
                        testMethod('some id').to(parent);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given a hyphenated element starting with the prefix and matching a type when converted to camel case', function() {

                    it('should call the callback with the correct type', function() {

                        var element = $('<prefix-hyphenated-type option="value"></prefix-hyphenated-type>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        internal.getSpecifiedAttributes = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('hyphenatedType');

                    });

                });

                describe('given an uppercase element starting with the prefix and matching a lowercase type', function() {

                    it('should call the callback with the correct type', function() {

                        var element = $('<prefix-UPPERCASE option="value"></prefix-UPPERCASE>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        internal.getSpecifiedAttributes = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('uppercase');

                    });

                });

            });

        });

    });

});