describe('internal.mappingUtilities', function() {

    describe('validateMapping', function() {

        var testMethod = internal.mappingUtilities.validateMapping;

        it('should throw an error if the mapping is undefined', function() {

            expect(function() {
                testMethod();
            }).toThrow('internal.mappingUtilities.validateMapping: invalid options');

        });

        it('should throw an error if the mapping contains no id property', function() {

            expect(function() {
                testMethod({});
            }).toThrow('internal.mappingUtilities.validateMapping: missing id');

        });

        it('should throw an error if the mapping contains no types', function() {

            expect(function() {
                testMethod({
                    id: 'some id'
                });
            }).toThrow('internal.mappingUtilities.validateMapping: missing types');

        });

        it('should throw an error if the passed in types is not an array', function() {

            expect(function() {
                testMethod({
                    id: 'some id',
                    types: 'foobar'
                });
            }).toThrow('internal.mappingUtilities.validateMapping: invalid types');

        });

        it('should throw an error if the mapping contains no callback', function() {

            expect(function() {
                testMethod({
                    id: 'some id',
                    prefix: 'data-',
                    types: ['foo', 'bar']
                });
            }).toThrow('internal.mappingUtilities.validateMapping: invalid callback');

        });

        it('should throw an error if the mappings contains an invalid mappingMode property"', function() {

            expect(function() {
                testMethod({
                    id: 'some id',
                    types: ['foo', 'bar'],
                    mappingMode: 'foobar',
                    callback: function() {}
                });
            }).toThrow('internal.mappingUtilities.validateMapping: invalid mappingMode');

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

    describe('completeMapping', function() {

        var testMethod = internal.mappingUtilities.completeMapping;

        it('should add the mappingMode "attribute" if the given mapping does not contain a mapping mode', function() {

            var mapping = {
                id: 'some id',
                types: ['calendar'],
                callback: function() {}
            };

            testMethod(mapping);

            expect(mapping.mappingMode).toBe('attribute');

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

    describe('optimizeMapping', function() {

        var testMethod = internal.mappingUtilities.optimizeMapping;

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

});