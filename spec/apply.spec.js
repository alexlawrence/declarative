var describe, it, expect, beforeEach;

require(
    ['apply', 'mappings', 'common/mappingModes', 'common/errors'],
    function(apply, mappings, mappingModes, errors) {

        var callbackSpy;

        var it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument = function(element) {
            it('should call the mapping callback with the DOM element as first argument', function() {
                expect(callbackSpy.argsForCall[0][0]).toBe(element);
            });
        };

        var it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument = function(type) {
            it('should call the mapping callback with the the type identifier as second argument', function() {
                expect(callbackSpy.argsForCall[0][1]).toBe(type);
            });
        };

        var it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument = function(property, value) {
            it('should call the mapping callback with the the parsed options as third argument', function() {
                if (property && value) {
                    expect(callbackSpy.argsForCall[0][2][property]).toBe(value);
                }
                else {
                    expect(callbackSpy.argsForCall[0][2]).toBeDefined();
                }
            });
        };

        beforeEach(function() {
            mappings.clear();
        });

        describe('apply', function() {

            var testMethod = apply;

            describe('given a single mapping id for an existing mapping in the registry', function() {

                it('should look up the given id in the existing mappings', function() {

                    spyOn(mappings, 'get').andCallFake(function() {});

                    testMethod('some id');

                    expect(mappings.get).toHaveBeenCalled();

                });

                it('should return an object containing a function to(element)', function() {

                    spyOn(mappings, 'get').andCallFake(function() {});

                    var subject = testMethod('some id');
                    expect(typeof subject.to).toBe('function');

                });

            });

            describe('given a single mapping with mapping mode "attribute"', function() {

                describe('declarative.apply(ids).to(element)', function() {

                    beforeEach(function() {

                        callbackSpy = jasmine.createSpy('apply.to.callback');

                        spyOn(mappings, 'get').andCallFake(function() {
                            return {
                                id: 'some id',
                                prefix: 'data-prefix-',
                                types: ['type', 'hyphenatedType', 'uppercase'],
                                convertedTypes: ['data-prefix-type', 'data-prefix-hyphenated-type', 'data-prefix-uppercase'],
                                callback: callbackSpy,
                                mappingMode: mappingModes.attribute
                            };
                        });

                    });

                    it('should throw an error if the passed object is not a DOM object', function() {

                        var subject = testMethod('foobar');
                        expect(function() {
                            subject.to({});
                        }).toThrow(errors.verifyDomElement);

                    });

                    describe('given an element with an attribute starting with the prefix and matching a type', function() {

                        var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);

                        beforeEach(function() {
                            testMethod('some id').to(element);
                        });

                        it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                        it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                        it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument('option', 'value');

                    });

                    describe('given an element with an attribute without value starting with the prefix and matching a type', function() {

                        var element = $('<div data-prefix-type></div>').get(0);

                        beforeEach(function() {
                            testMethod('some id').to(element);
                        });

                        it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                        it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                        it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument();

                    });

                    describe('given a parent containing a child with an attribute starting with the prefix and matching a type', function() {

                        var parent = $('<div id="parent"></div>').get(0);
                        var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);
                        parent.appendChild(element);

                        beforeEach(function() {
                            testMethod('some id').to(parent);
                        });

                        it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                        it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                        it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument('option', 'value');

                    });

                    describe('given a hyphenated attribute starting with the prefix and matching a type when converted to camel case', function() {

                        it('should call the callback with the correct type', function() {

                            var element = $('<div data-prefix-hyphenated-type="option: \'value\'"></div>').get(0);

                            testMethod('some id').to(element);

                            expect(callbackSpy.argsForCall[0][1]).toBe('hyphenatedType');

                        });

                    });

                    describe('given an element with an uppercase attribute starting with the prefix and matching a lowercase type', function() {

                        it('should call the callback with the correct type', function() {

                            var element = $('<div data-prefix-UPPERCASE="option: \'value\'"></div>').get(0);

                            testMethod('some id').to(element);

                            expect(callbackSpy.argsForCall[0][1]).toBe('uppercase');

                        });

                    });

                });

            });

            describe('given a single mapping with mapping mode "element"', function() {

                describe('declarative.apply(ids).to(element)', function() {

                    beforeEach(function() {

                        callbackSpy = jasmine.createSpy('apply.to.callback');

                        spyOn(mappings, 'get').andCallFake(function() {
                            return {
                                id: 'some id',
                                prefix: 'prefix-',
                                types: ['type', 'hyphenatedType', 'uppercase'],
                                convertedTypes: ['prefix-type', 'prefix-hyphenated-type', 'prefix-uppercase'],
                                callback: callbackSpy,
                                mappingMode: mappingModes.element
                            };
                        });

                    });


                    it('should throw an error if the passed object is not a DOM object', function() {

                        var subject = testMethod('foobar');
                        expect(function() {
                            subject.to({});
                        }).toThrow(errors.verifyDomElement);

                    });

                    describe('given an element with a name starting with the prefix and matching a type', function() {

                        var element = $('<prefix-type option="value"></prefix-type>').get(0);

                        beforeEach(function() {
                            testMethod('some id').to(element);
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
                            testMethod('some id').to(parent);
                        });

                        it_should_call_the_mapping_callback_with_the_DOM_element_as_first_argument(element);
                        it_should_call_the_mapping_callback_with_the_the_type_identifier_as_second_argument('type');
                        it_should_call_the_mapping_callback_with_the_the_parsed_options_as_third_argument();

                    });

                    describe('given a hyphenated element starting with the prefix and matching a type when converted to camel case', function() {

                        it('should call the callback with the correct type', function() {

                            var element = $('<prefix-hyphenated-type option="value"></prefix-hyphenated-type>').get(0);

                            testMethod('some id').to(element);

                            expect(callbackSpy.argsForCall[0][1]).toBe('hyphenatedType');

                        });

                    });

                    describe('given an uppercase element starting with the prefix and matching a lowercase type', function() {

                        it('should call the callback with the correct type', function() {

                            var element = $('<prefix-UPPERCASE option="value"></prefix-UPPERCASE>').get(0);

                            testMethod('some id').to(element);

                            expect(callbackSpy.argsForCall[0][1]).toBe('uppercase');

                        });

                    });

                });

            });

            describe('applying a single distinct mapping twice to the same element', function() {

                it('should call the callback only once', function() {

                    var callbackSpy = jasmine.createSpy('apply.to.callback');
                    var element = $('<div type="option: \'value\'"></div>').get(0);

                    spyOn(mappings, 'get').andCallFake(function() {
                        return {
                            id: 'some id',
                            types: ['type'],
                            convertedTypes: ['type'],
                            callback: callbackSpy,
                            mappingMode: 'attribute',
                            distinct: true
                        };
                    });

                    testMethod('some id').to(element);
                    testMethod('some id').to(element);

                    expect(callbackSpy.callCount).toBe(1);

                });

            });

        });

    }
);