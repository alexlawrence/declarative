describe('performance', function() {

    var countOfMappings = 5, countOfMatchingElements = 100, countOfNonMatchingElements = 1500;

    describe('applying ' + countOfMappings + ' non distinct mappings with 5 types to ' +
        countOfMatchingElements + ' elements with each 5 matching attributes and ' +
        countOfNonMatchingElements + ' elements with each 5 non matching attributes ', function() {

        it('should not cause the page to freeze', function() {

            var root = document.createElement('div'), parent, current, i;
            var matchingMarkup =
                '<div ' +
                'data-one="key: \'value\'" ' +
                'data-two="key: \'value\'" ' +
                'data-three="key: \'value\'" ' +
                'data-four="key: \'value\'" ' +
                'data-five="key: \'value\'">' +
                '</div>';
            parent = root;
            for (i = 0; i < countOfMatchingElements; i++) {
                $(parent).append(current = $(matchingMarkup));
                parent = current;
            }

            var nonMatchingMarkup =
                '<div ' +
                'one="key: \'value\'" ' +
                'two="key: \'value\'" ' +
                'three="key: \'value\'" ' +
                'four="key: \'value\'" ' +
                'five="key: \'value\'">' +
                '</div>';
            parent = root;
            for (i = 0; i < countOfNonMatchingElements; i++) {
                $(parent).append(current = $(nonMatchingMarkup));
                parent = current;
            }

            var calls = 0;
            var logCallback = function(element, type, options) {
                options.key == 'value' && calls++;
            };

            for (i = 0; i< countOfMappings; i++) {
                declarative.mappings.add({
                    id: 'test' + i,
                    prefix: 'data-',
                    types: ['one', 'two', 'three', 'four', 'five'],
                    callback: logCallback,
                    distinct: false
                });
            }

            var mappingIds = [];
            for (i = 0; i< countOfMappings; i++) {
                mappingIds.push('test' + i);
            }

            alert('starting test');

            var startTime = new Date();

            waitsForDeferred(declarative.apply(mappingIds).to(root));

            runs(function() {
                var elapsedTime = new Date() - startTime;
                alert('performance test took: ' + elapsedTime + ' ms');
                expect(calls).toBe(countOfMatchingElements * countOfMappings * 5);
            });

        });

    });

});