(function(parent) {

    var module = parent.array = {};

    module.ensureArray = function(value) {
        return module.isArray(value) ? value : [value];
    };

    module.isArray = function(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    module.indexOf = function(haystack, needle) {
        for (var i = 0, j = haystack.length; i < j; i++) {
            if (haystack[i] == needle) {
                return i;
            }
        }
        return -1;
    };

}(declarative));