(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        _globalName = factory();
    }
}(this, function () {

_code

_localName.version = _version;

return _localName;

}));