var describe, it, expect;

require(['dom/isDomElement'], function(isDomElement) {

    describe('dom/isDomElement', function() {

        var testMethod = isDomElement;

        it('should return false if given no element', function() {

            var result = testMethod();

            expect(result).toBeFalsy();

        });

        it('should return false if given an empty object', function() {

            var result = testMethod({});

            expect(result).toBeFalsy();

        });

        it('should return false if given a jquery selector result', function() {

            var result = testMethod($('<div></div>'));

            expect(result).toBeFalsy();

        });

        it('should return false if given a DOM attribute', function() {

            var attribute = document.createAttribute('something');

            var result = testMethod(attribute);

            expect(result).toBeFalsy();

        });

        it('should return true if given a DOM element', function() {

            var element = document.createElement('something');

            var result = testMethod(element);

            expect(result).toBeTruthy();

        });

        it('should return true if given the document element', function() {

            var result = testMethod(document);

            expect(result).toBeTruthy();

        });

    });

});