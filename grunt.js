module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-jasmine-task');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-reznik');

    var license =
        '/**\n' +
        ' * @license\n' +
        ' * declarative - Mapper for custom user interface markup - version <%= pkg.version %>\n' +
        ' * Copyright 2012, Alex Lawrence\n' +
        ' * Licensed under the MIT license.\n' +
        ' * http://www.opensource.org/licenses/MIT\n' +
        ' */';

    var version = 'declarative.version = "<%= pkg.version %>";';

    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            license: license,
            version: version
        },
        jasmine: {
          all: {
            src: ['spec/runner.html'],
            errorReporting: true
          }
        },
        concat: {
            license: {
                src: ['<banner:meta.license>'],
                dest: 'LICENSE.txt'
            },
            code: {
                src: [
                    'src/mmd.js','src/settings.js','src/errors.js','src/mappingModes.js',
                    'src/common/array.js','src/common/async.js','src/common/Deferred.js',
                    'src/common/hyphenate.js','src/common/parseOptions.js',
                    'src/dom/generateCssSelectors.js','src/dom/getRelevantElements.js','src/dom/getSpecifiedAttributes.js','src/dom/isDomElement.js',
                    'src/mapping/validateMapping.js','src/mapping/completeMapping.js','src/mapping/optimizeMapping.js',
                    'src/mapping/mappings.js','src/mapping/apply.js','src/mapping/applyAllMappings.js',
                    'src/export.js',
                    '<banner:meta.version>'
                ],
                dest: 'bin/declarative.js'
            },
            codeAndLicense: {
                src: ['<banner:meta.license>', 'bin/declarative.js'],
                dest: 'bin/declarative.js'
            }
        },
        umd: {
            all: {
                src: 'bin/declarative.js',
                dest: 'bin/declarative.js',
                objectToExport: 'declarative'
            }
        },
        min: {
            all: {
                src: ['<banner:meta.license>', 'bin/declarative.js'],
                dest: 'bin/declarative.min.js'
            }
        },
        reznik: {
            all: {
                basePath: 'src',
                analysis: 'all',
                exclude: 'mmd'
            }
        }
    });
    
    grunt.registerTask('default', 'jasmine reznik concat:code umd concat:codeAndLicense min');
    grunt.registerTask('licenseText', 'concat:license')

};