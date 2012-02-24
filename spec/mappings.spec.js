describe('declarative.mappings', function() {

    var subject = declarative.mappings;

    beforeEach(function() {
        subject.clear();
    });

    describe('mappings.add', function() {

        describe('given a single mapping entry', function() {

            it('should throw an error if the mapping is undefined', function() {

                expect(function() {
                    subject.add();
                }).toThrow('declarative.mappings.add: invalid options');

            });

            it('should throw an error if the mapping contains no id property', function() {

                expect(function() {
                    subject.add({});
                }).toThrow('declarative.mappings.add: missing id');

            });

            it('should throw an error if the mapping contains no prefix property', function() {

                expect(function() {
                    subject.add({id: 'some id'});
                }).toThrow('declarative.mappings.add: missing prefix');

            });

            it('should throw an error if the mapping contains no types', function() {

                expect(function() {
                    subject.add({
                        id: 'some id',
                        prefix: 'data-'
                    });
                }).toThrow('declarative.mappings.add: missing types');

            });

            it('should throw an error if the passed in types is not an array', function() {

                expect(function() {
                    subject.add({
                        id: 'some id',
                        prefix: 'data-',
                        types: 'foobar'
                    });
                }).toThrow('declarative.mappings.add: invalid types');

            });

            it('should throw an error if the mapping contains no callback', function() {

                expect(function() {
                    subject.add({
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar']
                    });
                }).toThrow('declarative.mappings.add: invalid callback');

            });

            it('should not throw an error if the mapping contains an id, a prefix, a types array and a callback', function() {

                expect(function() {
                    subject.add({
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar'],
                        callback: function() {}
                    });
                }).not.toThrow();

            });

            it('should throw an error if the passed in id matches another mapping id already added', function() {

                expect(function() {
                    subject.add({
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar'],
                        callback: function() {}
                    });
                    subject.add({
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar'],
                        callback: function() {}
                    });
                }).toThrow('declarative.mappings.add: duplicate id "some id"');

            });

        });

        describe('given a list of two mapping entries', function() {

            var validMapping = {
                id: 'some other id',
                prefix: 'data-',
                types: ['foo', 'bar'],
                callback: function() {}
            };

            it('should throw an error if one mapping is undefined', function() {

                expect(function() {
                    subject.add([undefined, validMapping]);
                }).toThrow('declarative.mappings.add: invalid options');

            });

            it('should throw an error if one contains no id property', function() {

                expect(function() {
                    subject.add([{}, validMapping]);
                }).toThrow('declarative.mappings.add: missing id');

            });

            it('should throw an error if one contains no prefix property', function() {

                expect(function() {
                    subject.add([{id: 'some id'}, validMapping]);
                }).toThrow('declarative.mappings.add: missing prefix');

            });

            it('should throw an error if one contains no types', function() {

                expect(function() {
                    subject.add([{
                        id: 'some id',
                        prefix: 'data-'
                    }, validMapping]);
                }).toThrow('declarative.mappings.add: missing types');

            });

            it('should throw an error if one contains types with type other than an array', function() {

                expect(function() {
                    subject.add([{
                        id: 'some id',
                        prefix: 'data-',
                        types: 'foobar'
                    }, validMapping]);
                }).toThrow('declarative.mappings.add: invalid types');

            });

            it('should throw an error if the mapping contains no callback', function() {

                expect(function() {
                    subject.add([{
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar']
                    }, validMapping]);
                }).toThrow('declarative.mappings.add: invalid callback');

            });

            it('should not throw an error if both contain an id, a prefix and a types array', function() {

                expect(function() {
                    subject.add([{
                        id: 'some id',
                        prefix: 'data-',
                        types: ['foo', 'bar'],
                        callback: function() {}
                    }, {
                        id: 'some other id',
                        prefix: 'data-',
                        types: ['foo', 'bar'],
                        callback: function() {}
                    }]);
                }).not.toThrow();

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

            it('should have transformed the prefix to lowercase when returning the mapping', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'someMixedCase',
                    types: ['calendar'],
                    callback: function() {}
                });

                var result = subject.get('some id');
                expect(result.prefix).toBe('somemixedcase');

            });

            it('should have transformed the prefix to lowercase when returning the mapping', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'someMixedCase',
                    types: ['calendar'],
                    callback: function() {}
                });

                var result = subject.get('some id');
                expect(result.prefix).toBe('somemixedcase');

            });

            it('should have added a typesAsAttributes object which contains all types combined with the prefix', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'prefix-',
                    types: ['calendar', 'counter'],
                    callback: function() {}
                });

                var result = subject.get('some id');
                expect(result.typesAsAttributes).toBeDefined();
                expect(result.typesAsAttributes[0]).toBe('prefix-calendar');
                expect(result.typesAsAttributes[1]).toBe('prefix-counter');

            });

            it('should have transformed all camel case types to hyphenated string in the typeMappings array', function() {

                subject.add({
                    id: 'some id',
                    prefix: 'prefix-',
                    types: ['someCasing', 'hereAlso'],
                    callback: function() {}
                });

                var result = subject.get('some id');
                expect(result.typesAsAttributes).toBeDefined();
                expect(result.typesAsAttributes[0]).toContain('some-casing');
                expect(result.typesAsAttributes[1]).toContain('here-also');

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

});