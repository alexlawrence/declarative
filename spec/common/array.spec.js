var describe, it, expect;

require(['common/array'], function(array) {

    describe('common/array', function() {

        var subject = array;

        describe('isArray(value)', function() {

            it('should return true for an array', function() {

                expect(subject.isArray([])).toBeTruthy();

            });

            it('should return false for a number', function() {

                expect(subject.isArray(5)).toBeFalsy();

            });

            it('should return false for a string', function() {

                expect(subject.isArray('foobar')).toBeFalsy();

            });

            it('should return false for a jQuery object', function() {

                expect(subject.isArray($)).toBeFalsy();

            });

        });

        describe('ensureArray(value)', function() {

            it('should return the original array if an array is given', function() {

                var result = subject.ensureArray([1, 2, 3, 4, 5]);

                expect(subject.isArray(result)).toBeTruthy();
                expect(result.length).toBe(5);

            });

            it('should return an array of length 1 if a simple value is given', function() {

                var result = subject.ensureArray(1);

                expect(subject.isArray(result)).toBeTruthy();
                expect(result.length).toBe(1);

            });

        });

        describe('indexOf(array, value)', function() {

            it('should return the correct index if the value exists in the array', function() {

                var result = subject.indexOf([1, 2, 3, 4, 5], 1);

                expect(result).toBe(0);

            });

            it('should return the correct index if the value exists in the array but has not the same type', function() {

                var result = subject.indexOf([1, 2, 3, 4, 5], '1');

                expect(result).toBe(0);

            });

            it('should return the -1 if the value does not exist in the array', function() {

                var result = subject.indexOf([1, 2, 3, 4, 5], 10);

                expect(result).toBe(-1);

            });

        });

    });

});