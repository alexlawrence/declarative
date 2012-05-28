var describe, it, expect;

require(['processing/validateMapping', 'common/errors'], function(validateMapping, errors) {

    describe('processing/validateMapping', function() {

        var testMethod = validateMapping;

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

});