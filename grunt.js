module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-jasmine-task');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-cjs2web');
    grunt.loadNpmTasks('grunt-closure-compiler');

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
                src: ['./spec/runner.html'],
                errorReporting: true
            }
        },
        cjs2web: {
            specs: {
                fileName: './spec/index.spec.js',
                combine: true,
                output: './spec/declarative.specs.generated.js'
            },
            code: {
                fileName: './src/index.js',
                basePath: './src',
                combine: true,
                output: './bin/declarative.js'
            }
        },
        concat: {
            license: {
                src: ['<banner:meta.license>'],
                dest: 'LICENSE.txt'
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
                objectToExport: '__index',
                globalAlias: 'declarative'
            }
        },
        'closure-compiler': {
            all: {
                closurePath: '/usr/local/opt/closure-compiler/libexec',
                js: 'bin/declarative.js',
                jsOutputFile: 'bin/declarative.min.js',
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                },
                noreport: true
            }
        }
    });

    grunt.registerTask('default', ['cjs2web:specs', 'jasmine', 'cjs2web:code', 'umd',
        'concat:codeAndLicense', 'closure-compiler', 'concat:license']);

};