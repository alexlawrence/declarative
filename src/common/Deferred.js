define('common/Deferred', function() {

    var Deferred = function() {

        if (!(this instanceof Deferred)) { return new Deferred(); }

        var status = null, resolved = 'resolved', rejected = 'rejected';
        var resolveArguments, rejectArguments;
        var successHandlers = [], errorHandlers = [];

        this.then = function(successHandler, errorHandler) {
            var child = new Deferred();

            errorHandler = errorHandler || function() {};
            successHandler = successHandler || function() {};
            successHandler = chainSuccessHandler(this, successHandler, child);

            if (status == resolved) {
                successHandler.apply(this, resolveArguments);
            }
            if (status == rejected) {
                errorHandler.apply(this, rejectArguments);
            }

            successHandlers.push(successHandler);
            errorHandlers.push(errorHandler);

            return child;
        };

        this.resolve = function() {
            if (!status) {
                resolveArguments = arguments;
                executeHandlers(this, successHandlers, resolveArguments);
                status = resolved;
            }
        };

        this.reject = function() {
            if (!status) {
                rejectArguments = arguments;
                executeHandlers(this, errorHandlers, rejectArguments);
                status = rejected;
            }
        };

    };

    var executeHandlers = function(scope, handlers, args) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            handlers[i].apply(scope, args);
        }
    };

    var chainSuccessHandler = function(scope, handler, deferred) {
        return function() {
            try {
                deferred.resolve(handler.apply(scope, arguments));
            }
            catch (error) {
                deferred.reject(error);
            }
        };
    };

    return Deferred;

});