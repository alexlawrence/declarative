require(['common/parseOptions'], function(parseOptions) {

    describe('common/parseOptions', function() {

        var testMethod = parseOptions;

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

});