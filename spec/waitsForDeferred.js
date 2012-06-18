var waitsForDeferred = function(deferred) {
    var resolved = false;
    deferred.then(function() {
        resolved = true;
    });
    waitsFor(function() {
        return resolved;
    });
};