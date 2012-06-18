define('common/async', function() {

    var async = function(callback) {

        var lastStart;

        var setStartAndExecuteCallback = function() {
            lastStart = new Date().getTime();
            callback(elapsedTime, scheduleNext);
        };

        var elapsedTime = function() {
            return (new Date()).getTime() - lastStart;
        };

        var scheduleNext = function(timeout) {
            setTimeout(setStartAndExecuteCallback, timeout);
        };

        setStartAndExecuteCallback();

    };

    return async;

});