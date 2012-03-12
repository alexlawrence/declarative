describe('declarative.apply', function() {

    var module = declarative;

    var originalMappingsGet = module.mappings.get;
    var originalMappingsGetAll = module.mappings.getAll;
    var originalParseOptions = module.parseOptions;
    var originalGetSpecifiedAttributes = module.getSpecifiedAttributes;
    var parseOptionsSpy;
    var getSpecifiedAttributesSpy;

    beforeEach(function() {
        parseOptionsSpy = jasmine.createSpy('parseOptions');
        getSpecifiedAttributesSpy = jasmine.createSpy('getSpecifiedAttributes');
        module.parseOptions = parseOptionsSpy;
        module.getSpecifiedAttributes = getSpecifiedAttributesSpy;
    });

    afterEach(function() {
        module.mappings.get = originalMappingsGet;
        module.mappings.getAll = originalMappingsGetAll;
        module.parseOptions = originalParseOptions;
        module.getSpecifiedAttributes = originalGetSpecifiedAttributes;
    });

    describe('declarative.applyAllMappings', function() {

        var testMethod = module.applyAllMappings;

        it('should request all mappings', function() {

            var spy = jasmine.createSpy('mappings.getAll');
            module.mappings.getAll = spy;

            testMethod();

            expect(spy).toHaveBeenCalled();

        });

        it('should return an object containing a function to(element)', function() {

            module.mappings.get = function() {
                return {};
            };

            var subject = testMethod();
            expect(typeof subject.to).toBe('function');

        });

    });

    describe('declarative.apply(ids)', function() {

        var testMethod = module.apply;

        describe('given a single mapping id for an existing mapping in the registry', function() {

            it('should look up the given id in the existing mappings', function() {

                var spy = jasmine.createSpy('mappings.get');
                module.mappings.get = spy;

                testMethod('some id');

                expect(spy).toHaveBeenCalled();

            });

            it('should return an object containing a function to(element)', function() {

                module.mappings.get = function() {
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

                    module.mappings.get = function() {
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

                    module.mappings.get = function() {
                        return {};
                    };

                    var subject = testMethod('foobar');
                    expect(function() {
                        subject.to({});
                    }).toThrow('declarative.apply.to: invalid element (DOM object required)');

                });

                describe('given an element with an attribute starting with the prefix and matching a type', function() {

                    var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);

                    it('should call parseStringOptions with the value of the attribute', function() {

                        testMethod('some id').to(element);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        module.parseOptions = function() {
                            return options;
                        };
                        testMethod('some id').to(element);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given an element with an attribute without value starting with the prefix and matching a type', function() {

                    var element = $('<div data-prefix-type></div>').get(0);

                    it('should call parseStringOptions with the value of the attribute', function() {

                        testMethod('some id').to(element);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {};
                        module.parseOptions = function() {
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

                    it('should call parseStringOptions with the value of the attribute', function() {

                        testMethod('some id').to(parent);
                        expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        module.parseOptions = function() {
                            return options;
                        };
                        testMethod('some id').to(parent);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given an element with a hyphenated attribute starting with the prefix and matching a type', function() {

                    it('should convert the attribute name after the prefix to camel case and call the callback', function() {

                        var element = $('<div data-prefix-hyphenated-type="option: \'value\'"></div>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        module.parseOptions = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('hyphenatedType');

                    });

                });

                describe('given an element with an uppercase attribute starting with the prefix', function() {

                    it('should convert the attribute name after the prefix to lowercase before calling the callback', function() {

                        var element = $('<div data-prefix-UPPERCASE="option: \'value\'"></div>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        module.parseOptions = function() {
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

                    module.mappings.get = function() {
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

                    module.mappings.get = function() {
                        return {};
                    };

                    var subject = testMethod('foobar');
                    expect(function() {
                        subject.to({});
                    }).toThrow('declarative.apply.to: invalid element (DOM object required)');

                });

                describe('given an element with a name starting with the prefix and matching a type', function() {

                    var element = $('<prefix-type option="value"></prefix-type>').get(0);

                    it('should call parseAttributeOptions passing in the the element', function() {

                        testMethod('some id').to(element);
                        expect(getSpecifiedAttributesSpy).toHaveBeenCalledWith(element);

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        module.getSpecifiedAttributes = function() {
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

                    it('should call parseAttributeOptions with the value of the attribute', function() {

                        testMethod('some id').to(parent);
                        expect(getSpecifiedAttributesSpy).toHaveBeenCalledWith(element);

                    });

                    it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                        var options = {option: 'value'};
                        module.getSpecifiedAttributes = function() {
                            return options;
                        };
                        testMethod('some id').to(parent);
                        expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                    });

                });

                describe('given an element with a hyphenated name starting with the prefix and matching a type', function() {

                    it('should convert the element name after the prefix to camel case and call the callback', function() {

                        var element = $('<prefix-hyphenated-type option="value"></prefix-hyphenated-type>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        module.getSpecifiedAttributes = function() {
                            return options;
                        };

                        callbackSpy = function(element, type) {
                            typeSpy(type);
                        };

                        testMethod('some id').to(element);

                        expect(typeSpy).toHaveBeenCalledWith('hyphenatedType');

                    });

                });

                describe('given an element with an uppercase name starting with the prefix', function() {

                    it('should convert the element name after the prefix to lowercase before calling the callback', function() {

                        var element = $('<prefix-UPPERCASE option="value"></prefix-UPPERCASE>').get(0);
                        var options = {option: 'value'};
                        var typeSpy = jasmine.createSpy('apply.to.callback.type');

                        module.getSpecifiedAttributes = function() {
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