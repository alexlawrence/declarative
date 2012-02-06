(function (module) {

    'use strict';

    module.mappings = {};

    module.mappings.clear = function() {
        mappings = {};
    };

    module.mappings.add = function(options) {
        validateAddOptions(options);
        mappings[options.id] = options;
    };

    module.mappings.get = function (id) {
        mappings[id] || generateError('get', 'invalid id "' + id + '"');
        return mappings[id];
    };

    var validateAddOptions = function(options) {
        options || generateError('add', 'invalid options');
        options.id || generateError('add', 'missing id');
        options.attributePrefix || generateError('add', 'missing attributePrefix');
    };

    var generateError = function(method, message) {
        throw new Error('declarative.mappings.' + method + ': ' + message);
    };

    var mappings = {};

}(declarative));