describe('internal.hyphenate', function() {

    var testMethod = internal.hyphenate;

    it('should return lowercase strings unmodified', function() {

        var input = 'lowercase';

        var result = testMethod(input);

        expect(result).toBe(input);

    });

    it('should replace uppercase characters with a lowercase counterpart preceeded by a hyphen', function() {

        var input = 'upperCaseText';

        var result = testMethod(input);

        expect(result).toBe('upper-case-text');

    });

    it('should replace an uppercase character even if it is the first one in the given string', function() {

        var input = 'Test';

        var result = testMethod(input);

        expect(result).toBe('-test');

    });

});