require(['mapping/applyAllMappings', 'mapping/mappings'], function(applyAllMappings, mappings) {

    describe('mapping/applyAllMappings', function() {

        var testMethod = applyAllMappings;
        var result;

        beforeEach(function() {
            mappings.clear();
            spyOn(mappings, 'getAll').andCallThrough();
            result = testMethod();
        });

        it('should request all mappings', function() {
            expect(mappings.getAll).toHaveBeenCalled();

        });

        it('should return an object containing a function to(element)', function() {
            expect(typeof result.to).toBe('function');
        });

    });

});