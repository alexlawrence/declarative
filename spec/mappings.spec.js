describe('declarative.mappings', function() {

    var subject = declarative.mappings;
    var mappingUtilities = internal.mappingUtilities;

    beforeEach(function() {
        subject.clear();
    });

    describe('mappings.add', function() {

        var originalValidateMapping = mappingUtilities.validateMapping;
        var originalCompleteMapping = mappingUtilities.completeMapping;
        var originalOptimizeMapping = mappingUtilities.optimizeMapping;
        var validateMappingSpy;
        var completeMappingSpy;
        var optimizeMappingSpy;

        beforeEach(function() {
            validateMappingSpy = jasmine.createSpy('internal.mappingUtilities.validateMapping');
            completeMappingSpy = jasmine.createSpy('internal.mappingUtilities.completeMapping');
            optimizeMappingSpy = jasmine.createSpy('internal.mappingUtilities.optimizeMapping');
            mappingUtilities.validateMapping = validateMappingSpy;
            mappingUtilities.completeMapping = completeMappingSpy;
            mappingUtilities.optimizeMapping = optimizeMappingSpy;
        });

        afterEach(function() {
            mappingUtilities.validateMapping = originalValidateMapping;
            mappingUtilities.completeMapping = originalCompleteMapping;
            mappingUtilities.optimizeMapping = originalOptimizeMapping;
        });

        describe('given a single mapping entry', function() {

            var mapping;

            beforeEach(function() {

                mapping = {
                    id: 'some id',
                    types: ['foo', 'bar'],
                    callback: function() {}
                };
                subject.add(mapping);

            });

            it('should call internal.mappingUtilities.validateMapping for the given mapping', function() {
                expect(validateMappingSpy).toHaveBeenCalledWith(mapping);
            });

            it('should call internal.mappingUtilities.completeMapping for the given mapping', function() {
                expect(completeMappingSpy).toHaveBeenCalledWith(mapping);
            });

            it('should call internal.mappingUtilities.optimizeMapping for the given mapping', function() {
                expect(optimizeMappingSpy).toHaveBeenCalledWith(mapping);
            });

        });

        describe('given a list of two mapping entries', function() {

            var mapping1, mapping2;

            beforeEach(function() {

                mapping1 = {
                    id: 'id 1',
                    types: ['foo', 'bar'],
                    callback: function() {}
                };
                mapping2 = {
                    id: 'id 2',
                    types: ['foo', 'bar'],
                    callback: function() {}
                };
                subject.add([mapping1, mapping2]);

            });

            it('should call internal.mappingUtilities.validateMapping for each given mapping', function() {
                expect(validateMappingSpy).toHaveBeenCalledWith(mapping1);
                expect(validateMappingSpy).toHaveBeenCalledWith(mapping2);
            });

            it('should call internal.mappingUtilities.completeMapping for each given mapping', function() {
                expect(completeMappingSpy).toHaveBeenCalledWith(mapping1);
                expect(completeMappingSpy).toHaveBeenCalledWith(mapping2);
            });

            it('should call internal.mappingUtilities.completeMapping for each given mapping', function() {
                expect(optimizeMappingSpy).toHaveBeenCalledWith(mapping1);
                expect(optimizeMappingSpy).toHaveBeenCalledWith(mapping2);
            });

        });

    });

    describe('mappings.get', function() {

        describe('given a single mapping id', function() {

            it('should throw an error if the id does not exist in the registry', function() {

                expect(function() {
                    subject.get('some id');
                }).toThrow('declarative.mappings.get: invalid id "some id"');

            });

            it('should return the mapping with the given id if it exists in the registry', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'data-',
                    types: ['calendar'],
                    callback: function() {}
                });

                var result = subject.get('some id');

                expect(result).toBeDefined();
                expect(result.prefix).toBe('data-');
                expect(result.types[0]).toBe('calendar');
                expect(typeof result.callback).toBe('function');

            });

        });

        describe('given a list of two mapping ids', function() {

            it('should throw an error if one of the ids does not exist in the registry', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'data-',
                    types: ['calendar'],
                    callback: function() {}
                });

                expect(function() {
                    subject.get(['some id', 'some other id']);
                }).toThrow('declarative.mappings.get: invalid id "some other id"');

            });

            it('should return both mappings with the given ids if all exist in the registry', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'data-',
                    types: ['calendar'],
                    callback: function() {}
                });

                subject.add({
                    id: 'some other id',
                    prefix: 'data-',
                    types: ['calendar'],
                    callback: function() {}
                });

                var result = subject.get(['some id', 'some other id']);

                expect(result).toBeDefined();
                expect(result.length).toBe(2);

            });

        });

    });

    describe('mappings.getAll', function() {

        it('should return a list of all mappings', function() {

            subject.add({
                id: '1',
                types: ['type'],
                callback: function() {}
            });
            subject.add({
                id: '2',
                types: ['type'],
                callback: function() {}
            });
            subject.add({
                id: '3',
                types: ['type'],
                callback: function() {}
            });
            subject.add({
                id: '4',
                types: ['type'],
                callback: function() {}
            });
            subject.add({
                id: '5',
                types: ['type'],
                callback: function() {}
            });

            var result = subject.getAll();

            expect(result.length).toBe(5);

        });

    });

});