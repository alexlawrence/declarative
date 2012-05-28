define('dom/isDomElement', function() {

    var isDomElement = function(element) {
        return element &&
            (element.nodeType === ELEMENT_NODE || element.nodeType === DOCUMENT_NODE);
    };

    var ELEMENT_NODE = 1, DOCUMENT_NODE = 9;

    return isDomElement;

});