(function(){

    var isDOMElement = internal.isDOMElement;

    declarative.getSpecifiedAttributes = function(element) {
        verifyDOMElement(element);
        var attributes = element.attributes, attribute, specifiedAttributes = {};
        for (var i = 0, j = attributes.length; i < j; i++) {
            attribute = attributes[i];
            if (attribute.specified) {
                specifiedAttributes[attribute.nodeName] = attribute.nodeValue;
            }
        }
        return specifiedAttributes;
    };

    var verifyDOMElement = function(element) {
        if (!isDOMElement(element)) {
            throw new Error('declarative.getSpecifiedAttributes: invalid element (DOM element required)');
        }
    };

}());