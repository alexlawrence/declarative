describe('internal.getSpecifiedAttributes', function() {

    var testMethod = internal.getSpecifiedAttributes;

    it('should throw an error if not given a DOM element', function() {

        var element = {};

        expect(function() {
            testMethod(element);
        }).toThrow('declarative.getSpecifiedAttributes: invalid element (DOM element required)');

    });

    it('should return an object if given a valid DOM element', function() {

        var element = document.createElement('element');

        var result = testMethod(element);

        expect(result).toBeDefined();

    });

    it('should return an object with all specified attribute keys and values of the DOM element', function() {

        var element = document.createElement('element');
        element.setAttribute('one', 'one');
        element.setAttribute('two', 'two');
        element.setAttribute('three', 'three');

        var result = testMethod(element);

        expect(result.one).toBe('one');
        expect(result.two).toBe('two');
        expect(result.three).toBe('three');

    });

    it('should not add any not specified attributes as properties to the result object', function() {

        var element = document.createElement('element');
        element.setAttribute('one', 'one');
        element.setAttribute('two', 'two');
        element.setAttribute('three', 'three');

        var result = testMethod(element);

        var countOfProperties = 0;
        for (var property in result) {
            if (result.hasOwnProperty(property)) {
                countOfProperties++;
            }
        }

        expect(countOfProperties).toBe(3);

    });


});