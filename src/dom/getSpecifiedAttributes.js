define('dom/getSpecifiedAttributes', ['common/errors', 'dom/isDomElement'], function(errors, isDomElement) {

    var getSpecifiedAttributes = function(element) {
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
        if (!isDomElement(element)) {
            throw new Error(errors.verifyDomElement);
        }
    };

    return getSpecifiedAttributes;

});