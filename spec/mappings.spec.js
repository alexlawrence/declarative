describe('declarative.mappings', function() {

    var subject = declarative.mappings;

    beforeEach(function() {
        subject.clear();
    });

    describe('mappings.add', function() {

        it('should throw an error if no object is given', function() {

            expect(function() {
                subject.add();
            }).toThrow('declarative.mappings.add: invalid options');

        });

        it('should throw an error if the given object does not contain an id property', function() {

            expect(function() {
                subject.add({});
            }).toThrow('declarative.mappings.add: missing id');

        });

        it('should throw an error if the given object does not contain a attributePrefix property', function() {

            expect(function() {
                subject.add({id: 'some id'});
            }).toThrow('declarative.mappings.add: missing attributePrefix');

        });

        it('should not throw an error if the given object contains an id and attributePrefix property', function() {

            expect(function() {
                subject.add({
                    id: 'some id',
                    attributePrefix: 'data-'
                });
            }).not.toThrow();

        });


    });

    describe('mappings.get', function() {

        it('should throw an error if given name does not exist in registry', function() {

            expect(function() {
                subject.get('some id');
            }).toThrow('declarative.mappings.get: invalid id "some id"');

        });

    });


    it('should add a valid entry to the registry via add() and make it available via get()', function() {

        subject.add({
            id: 'test',
            attributePrefix: 'data-',
            types: ['calendar'],
            callback: function(element, type, options) {

            }
        });

        var result = subject.get('test');

        expect(result).toBeDefined();
        expect(result.attributePrefix).toBe('data-');
        expect(result.types[0]).toBe('calendar');
        expect(typeof result.callback).toBe('function');

    });
});