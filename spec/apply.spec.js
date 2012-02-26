describe('declarative.apply(ids)', function() {

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

    describe('given a single mapping id for an existing mapping in the registry', function() {

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

        describe('declarative.apply(ids).to(element)', function() {

            var callbackSpy;

            beforeEach(function() {

                callbackSpy = jasmine.createSpy('apply.to.callback');

                module.mappings.get = function() {
                    return {
                        id: 'some id',
                        prefix: 'data-prefix-',
                        types: ['type', 'hyphenatedType', 'uppercase'],
                        typesAsAttributes: ['data-prefix-type', 'data-prefix-hyphenated-type', 'data-prefix-uppercase'],
                        callback: callbackSpy
                    };
                };

            });

            it('should throw an error if the passed object is not a DOM object', function() {

                module.mappings.get = function() {
                    return {};
                };

                var subject = module.apply('foobar');
                expect(function() {
                    subject.to({});
                }).toThrow('declarative.apply.to: invalid element (DOM object required)');

            });

            describe('given an element with an attribute starting with the prefix and matching a type', function() {

                var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);

                it('should call parseOptions with the value of the attribute', function() {

                    module.apply('some id').to(element);
                    expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                });

                it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                    var options = {option: 'value'};
                    module.parseOptions = function() {
                        return options;
                    };
                    module.apply('some id').to(element);
                    expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                });

            });

            describe('given an element with an attribute without value starting with the prefix and matching a type', function() {

                var element = $('<div data-prefix-type></div>').get(0);

                it('should call parseOptions with the value of the attribute', function() {

                    module.apply('some id').to(element);
                    expect(parseOptionsSpy).toHaveBeenCalledWith("");

                });

                it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                    var options = {};
                    module.parseOptions = function() {
                        return options;
                    };
                    module.apply('some id').to(element);
                    expect(callbackSpy).toHaveBeenCalledWith(element, 'type', options);

                });

            });

            describe('given a parent containing a child with an attribute starting with the prefix and matching a type', function() {

                var parent = $('<div id="parent"></div>').get(0);
                var element = $('<div data-prefix-type="option: \'value\'"></div>').get(0);
                parent.appendChild(element);

                it('should call parseOptions with the value of the attribute', function() {

                    module.apply('some id').to(parent);
                    expect(parseOptionsSpy).toHaveBeenCalledWith("option: 'value'");

                });

                it('should call the mapping callback with the DOM element, the type identifier and the parsed options', function() {

                    var options = {option: 'value'};
                    module.parseOptions = function() {
                        return options;
                    };
                    module.apply('some id').to(parent);
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

                    module.apply('some id').to(element);

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

                    module.apply('some id').to(element);

                    expect(typeSpy).toHaveBeenCalledWith('uppercase');

                });

            });

            describe('given a mapping with a mixed case attribute prefix but without explicit types', function() {

                it('should convert the type prefix to lowercase before matching it against attributes', function() {

                    var callbackSpy = jasmine.createSpy('apply.to.callback');

                    module.mappings.get = function() {
                        return {
                            id: 'some id',
                            prefix: 'data-prefixWithCasing-',
                            types: ['type'],
                            typesAsAttributes: ['data-prefixWithcasing-type'],
                            callback: callbackSpy
                        };
                    };

                    var element = $('<div data-prefixwithcasing-type="option: \'value\'"></div>').get(0);

                    module.apply('some id').to(element);

                    expect(callbackSpy).toHaveBeenCalled();

                });


            });

        });

    });

});