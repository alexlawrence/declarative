describe('dom/getRelevantElements', function() {

    var testMethod = require('../../src/dom/getRelevantElements');

    it('should request all elements if no query selectors are available', function() {

        var element = {getElementsByTagName: function() {}};
        spyOn(element, 'getElementsByTagName').andCallThrough();

        testMethod(element, []);

        expect(element.getElementsByTagName).toHaveBeenCalled();

    });

    it('should use query selectors if they are available', function() {

        var element = {querySelectorAll: function() {}};
        spyOn(element, 'querySelectorAll').andCallThrough();

        testMethod(element, []);

        expect(element.querySelectorAll).toHaveBeenCalled();

    });

});