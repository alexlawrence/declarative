module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-jasmine-task');

    grunt.initConfig({
        jasmine: {
          all: {
            src: ['spec/runner.html'],
            errorReporting: true
          }
        },
        concat: {
            code: {
                src: [
                    'src/umd/start.js',
                    'src/mmd.js','src/settings.js','src/errors.js','src/mappingModes.js',
                    'src/common/array.js','src/common/async.js','src/common/Deferred.js',
                    'src/common/hyphenate.js','src/common/parseOptions.js',
                    'src/dom/generateCssSelectors.js','src/dom/getRelevantElements.js','src/dom/getSpecifiedAttributes.js','src/dom/isDomElement.js',
                    'src/mapping/validateMapping.js','src/mapping/completeMapping.js','src/mapping/optimizeMapping.js',
                    'src/mapping/mappings.js','src/mapping/apply.js','src/mapping/applyAllMappings.js',
                    'src/export.js',
                    'src/umd/end.js'
                ],
                dest: 'bin/declarative.js'
            },
            license: {
                src: ['LICENSE.txt', 'bin/declarative.js'],
                dest: 'bin/declarative.js'
            },
            licenseMinified: {
                src: ['LICENSE.txt', 'bin/declarative.min.js'],
                dest: 'bin/declarative.min.js'
            }
        },
        min: {
            all: {
                src: ['bin/declarative.js'],
                dest: 'bin/declarative.min.js'
            }
        }
    });

    grunt.registerTask('umd', 'Surrounds the code with the universal module definition', function() {
        var umd = grunt.file.read('src/umd.js');
        var code = grunt.file.read('bin/declarative.js');
        code = umd.replace(/\$\{code\}/, code);
        grunt.file.write('bin/declarative.js', code);
    });
    
    grunt.registerTask('version', 'Adds the version number from package.json to the code', function() {
        addLicense('bin/declarative.js');
        addLicense('bin/declarative.min.js');
    });
    
    var addLicense = (function() {
        var packageInfo = grunt.file.readJSON('package.json');
        return function(filename) {
            var code = grunt.file.read(filename);
            code = code.replace(/\$\{version\}/g, packageInfo.version);
            grunt.file.write(filename, code);
        };
    }());
    
    grunt.registerTask('default', 'jasmine concat:code umd min concat:license concat:licenseMinified version');

};