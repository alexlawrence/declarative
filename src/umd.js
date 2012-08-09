(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.declarative = factory();
    }
}(this, function () {

${code}

declarative.version = '${version}';

return declarative;

}));