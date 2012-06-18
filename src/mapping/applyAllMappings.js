define('mapping/applyAllMappings',
    ['mapping/mappings', 'mapping/apply'],
    function(mappings, apply) {

        return function () {
            var ids = [], allMappings = mappings.getAll();
            for (var i = 0, j = allMappings.length; i < j; i++) {
                ids.push(allMappings[i].id);
            }
            return apply(ids);
        };

    }
);