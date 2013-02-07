describe('mapping/completeMapping', function() {

    var testMethod = require('../../src/mapping/completeMapping');
    var mappingModes = require('../../src/mappingModes');

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