describe('declarative', function() {

    it('should provide a global object named declarative', function() {

        expect(declarative).toBeDefined();
        expect(typeof declarative).toBe('object');

    });

    it('should provide a global object named internal', function() {

        expect(internal).toBeDefined();
        expect(typeof internal).toBe('object');

    });

});