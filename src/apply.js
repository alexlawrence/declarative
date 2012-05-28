define('apply',
    ['common/array', 'mappings', 'applyMappingsTo'],
    function(array, mappings, applyMappingsToWrapper) {

        return function (ids) {
            var mappingsToApply = mappings.get(ids);
            mappingsToApply = array.ensureArray(mappingsToApply);
            return applyMappingsToWrapper(mappingsToApply);
        };

    }
);