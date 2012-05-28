define('applyAllMappings',
    ['mappings', 'applyMappingsTo'],
    function( mappings, applyMappingsTo) {

        return function () {
            return applyMappingsTo(mappings.getAll());
        };

    }
);