describe('common/async', function() {

    var async = require('../../src/common/async');

    it('should call the given callback immediately once', function() {
        var spy = jasmine.createSpy('async');
        async(spy);

        expect(spy).toHaveBeenCalled();
    });

    it('should pass an "elapsed time" function as first argument to the callback', function() {
        async(function(elapsedTime) {
            expect(elapsedTime instanceof Function).toBeTruthy();
            expect(typeof elapsedTime()).toBe('number');
        });
    });

    it('should pass a "schedule next execution" function as second argument to the callback', function() {
        async(function(elapsedTime, scheduleNext) {
            expect(scheduleNext instanceof Function).toBeTruthy();
        });
    });


    it('should execute the callback again when another execution is scheduled (after given timeout)', function() {
        var callCount = 0;
        async(function(elapsedTime, scheduleNext) {
            callCount++;
            if (callCount == 1) {
                scheduleNext(100);
            }
        });
        expect(callCount).toBe(1);
        waitsFor(function() { return callCount == 2; });
        runs(function() { expect(callCount).toBe(2); });
    });

});