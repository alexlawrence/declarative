(function(){

    declarative.isDOMElement = function(element) {
        return element && element.nodeType === ELEMENT_NODE;
    };

    var ELEMENT_NODE = 1;

}());