describe('mapping/mappings', function() {

    var subject = require('../../src/mapping/mappings');
    var errors = require('../../src/errors');

    beforeEach(function() {
        subject.clear();
    });

    describe('when adding a mapping', function() {

        var _result;

        beforeEach(function() {
            _result = subject.add({id: 'id', types: ['calendar'], callback: function() {}});
        });

        it('should return the mappings module in order to enable chaining', function() {
            expect(_result).toBe(subject);
        });

    });

    describe('adding and requesting a single mapping', function() {

        it('should return the mapping with the given id if it was previously added to the registry', function() {

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

        it('should throw an error if the requested mapping does not exist in the registry', function() {

            expect(function() {
                subject.get('some id');
            }).toThrow(errors.getSingleMapping);

        });

    });

    describe('adding and requesting two mappings', function() {

        it('should return both mappings with the given ids if they were previously added to the registry', function() {

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

        it('should throw an error if one of the requested mappings does not exist in the registry', function() {

            subject.add({
                id: 'some id',
                prefix: 'data-',
                types: ['calendar'],
                callback: function() {}
            });

            expect(function() {
                subject.get(['some id', 'some other id']);
            }).toThrow(errors.getSingleMapping);

        });

    });

});

describe('mappings.getAll', function() {

    var subject = require('../../src/mapping/mappings');

    beforeEach(function() {
        subject.clear();
    });

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