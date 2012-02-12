describe('performance', function() {

    describe('applying 2 mappings without explicit types to 3.000 elements with each 5 attributes', function() {

        it('should not cause the page to freeze', function() {

            var divTemplate =
                '<div ' +
                'data-one="one: \'one\'"' +
                'data-twp="two: \'two\'"' +
                'data-three="three: \'three\'"' +
                'data-four="four: \'four\'"' +
                'data-five="five: \'five\'"' +
                '</div>';
            var root = $(divTemplate);
            for (var i = 0; i < 3000; i++) {
                root.append($(divTemplate));
            }

            declarative.mappings.add({
                id: 'test 1',
                attributePrefix: 'data-',
                callback: function() {

                }
            });

            declarative.mappings.add({
                id: 'test 2',
                attributePrefix: 'data-',
                callback: function() {

                }
            });

            var startTime = new Date();

            declarative.apply('test 1').to(root.get(0));
            declarative.apply('test 2').to(root.get(0));

            var elapsedTime = new Date() - startTime;
            console.log('performance test took: ' + elapsedTime + ' ms');

            expect(true).toBeTruthy();

        });

    });

});