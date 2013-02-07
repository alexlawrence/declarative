describe('mapping/optimizeMapping', function() {

    var testMethod = require('../../src/mapping/optimizeMapping');

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