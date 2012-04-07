(function(){

    var mappingModes = internal.mappingModes;

    internal.getRelevantElements = function(mappings, element) {
        if (element.querySelectorAll) {
            return getRelevantElementsByCssSelectors(mappings, element);
        }
        return element.all ? element.all : element.getElementsByTagName('*');
    };

    var getRelevantElementsByCssSelectors = function(mappings, element) {
        var typesByMappingMode = {};
        typesByMappingMode[mappingModes.attribute] = [];
        typesByMappingMode[mappingModes.element] = [];
        for (var i = 0, j = mappings.length; i < j; i++) {
            var mapping = mappings[i], mappingMode = mapping.mappingMode;
            typesByMappingMode[mappingMode] =
                typesByMappingMode[mappingMode].concat(mapping.convertedTypes);
        }
        var selector = internal.generateCssSelectors(typesByMappingMode);
        return element.querySelectorAll(selector);
    };

}());