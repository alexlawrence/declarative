describe('internal.generateCssSelectors', function() {

    var testMethod = internal.generateCssSelectors;
    var mappingModes = internal.mappingModes;

    it('should throw an error for an empty object', function() {

        expect(function() { testMethod({}); }).toThrow();

    });

    it('should return an empty string for an object containing empty mapping mode arrays', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('');

    });

    it('should return a singe element selector for one type in the element mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = ['type'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('type');

    });

    it('should return a single attribue selector for one type in the attribute mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type'];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type]');

    });

    it('should return multiple element selectors for mulitple types in the element mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = ['type1', 'type2'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('type1,type2');

    });

    it('should return multiple attribute selectors for mulitple types in the attribute mapping mode', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type1', 'type2'];
        typesByMappingMode[mappingModes.element] = [];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type1],[type2]');

    });

    it('should return a combined selector list for mulitple types in both mapping modes', function() {

        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = ['type1', 'type2'];
        typesByMappingMode[mappingModes.element] = ['type3', 'type4'];

        var result = testMethod(typesByMappingMode);

        expect(result).toBe('[type1],[type2],type3,type4');

    });

});