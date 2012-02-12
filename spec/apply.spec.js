describe('declarative.apply', function() {

    var module = declarative;

    var originalMappingsGet = module.mappings.get;
    var originalParseOptions = module.parseOptions;
    var parseOptionsSpy;

    beforeEach(function() {
        parseOptionsSpy = jasmine.createSpy('parseOptions');
        module.parseOptions = parseOptionsSpy;
    });

    afterEach(function() {
        module.mappings.get = originalMappingsGet;
        module.parseOptions = originalParseOptions;
    });

    it('should look up the given id in the existing mappings', function() {

        var spy = jasmine.createSpy('mappings.get');
        module.mappings.get = spy;

        module.apply('some id');

        expect(spy).toHaveBeenCalled();

    });

    it('should return an object containing a function to(element)', function() {

        module.mappings.get = function() {
            return {};
        };

        var subject = module.apply('some id');
        expect(typeof subject.to).toBe('function');

    });

    describe('declarative.apply.to', function() {

        it('should throw an error if the passed object is not a DOM object', function() {

            module.mappings.get = function() {
                return {};
            };

            var subject = module.apply('foobar');
            expect(function() {
                subject.to({});
            }).toThrow('declarative.apply.to: invalid element (DOM object required)');

        });

        describe('given a mapping with an attribute prefix but without explicit types', function() {

            var callbackSpy = jasmine.createSpy('apply.to.callback');

            beforeEach(function() {
                module.mappings.get = function() {
                    return {
                        id: 'some id',
                        attributePrefix: 'data-prefix-',
                        callback: callbackSpy
                    };
                };

            });

            describe('given an element with an attribute starting with the attribute prefix', function() {

                var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);

                it('should call parseOptions with the value of the attribute', function() {

                    module.apply('some id').to(element);
                    expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                });

                it('should call the mapping callback with the element, the attribute name after the prefix and the parsed options', function() {

                    var options = {option: 'value'};
                    module.parseOptions = function() {
                        return options;
                    };
                    module.apply('some id').to(element);
                    expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                });

            });

            describe('given a parent containing a child with an attribute starting with the attribute prefix', function() {

                var parent = $('<div id="parent"></div>').get(0);
                var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);
                parent.appendChild(element);

                it('should call parseOptions with the value of the attribute', function() {

                    module.apply('some id').to(parent);
                    expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                });

                it('should call the mapping callback with the element, the attribute name after the prefix and the parsed options', function() {

                    var options = {option: 'value'};
                    module.parseOptions = function() {
                        return options;
                    };
                    module.apply('some id').to(parent);
                    expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                });

            });

            describe('given an element with a hyphenated attribute starting with the attribute prefix', function() {

                it('should convert the attribute name after the prefix to camel case before calling the callback', function() {

                    var element = $('<div data-prefix-hyphenated-type="option: \'value\'"></div>').get(0);
                    var options = {option: 'value'};
                    var typeSpy = jasmine.createSpy('apply.to.callback.type');

                    module.parseOptions = function() {
                        return options;
                    };

                    module.mappings.get = function() {
                        return {
                            id: 'some id',
                            attributePrefix: 'data-prefix-',
                            callback: function(element, type) {
                                typeSpy(type);
                            }
                        }
                    };

                    module.apply('some id').to(element);

                    expect(typeSpy).toHaveBeenCalledWith('hyphenatedType');

                });

            });

            describe('given an element with an uppercase attribute starting with the attribute prefix', function() {

                it('should convert the attribute name after the prefix to lowercase before calling the callback', function() {

                    var element = $('<div data-prefix-UPPERCASE="option: \'value\'"></div>').get(0);
                    var options = {option: 'value'};
                    var typeSpy = jasmine.createSpy('apply.to.callback.type');

                    module.parseOptions = function() {
                        return options;
                    };

                    module.mappings.get = function() {
                        return {
                            id: 'some id',
                            attributePrefix: 'data-prefix-',
                            callback: function(element, type) {
                                typeSpy(type);
                            }
                        }
                    };

                    module.apply('some id').to(element);

                    expect(typeSpy).toHaveBeenCalledWith('uppercase');

                });

            });

        });

        describe('given a mapping with a mixed case attribute prefix but without explicit types', function() {

            it('should convert the attribute prefix to lowercase before matching it against attributes', function() {

                var callbackSpy = jasmine.createSpy('apply.to.callback');

                module.mappings.get = function() {
                    return {
                        id: 'some id',
                        attributePrefix: 'data-prefixWithCasing-',
                        callback: callbackSpy
                    };
                };

                var element = $('<div data-prefixwithcasing-type="option: \'value\'"></div>').get(0);

                module.apply('some id').to(element);

                expect(callbackSpy).toHaveBeenCalled();

            });


        });

        describe('given a mapping with an attribute prefix and an array of explicit valid types', function() {

            var typeSpy;

            beforeEach(function() {

                typeSpy = jasmine.createSpy('apply.to.callback.type');

                module.mappings.get = function() {
                    return {
                        id: 'some id',
                        attributePrefix: 'data-test-',
                        validTypes: ['valid', 'validHyphenated'],
                        callback: function(element, type) {
                            typeSpy(type);
                        }
                    };
                };

            });

            it('should call the callback for an element with a type contained in the valid types', function() {

                var element = $('<div data-test-valid="option: \'value\'"></div>').get(0);

                var options = {option: 'value'};
                module.parseOptions = function() {
                    return options;
                };
                module.apply('some id').to(element);
                expect(typeSpy).toHaveBeenCalledWith('valid');

            });

            it('should not call the callback for an element with a type not contained in the valid types', function() {

                var element = $('<div data-test-invalid="option: \'value\'"></div>').get(0);

                var options = {option: 'value'};
                module.parseOptions = function() {
                    return options;
                };
                module.apply('some id').to(element);
                expect(typeSpy).not.toHaveBeenCalled();

            });

            it('should call the callback for an element with a hyphenated type contained as pascal case in the valid types', function() {

                var element = $('<div data-test-valid-hyphenated="option: \'value\'"></div>').get(0);

                var options = {option: 'value'};
                module.parseOptions = function() {
                    return options;
                };
                module.apply('some id').to(element);
                expect(typeSpy).toHaveBeenCalledWith('validHyphenated');

            });

        });

    });

});