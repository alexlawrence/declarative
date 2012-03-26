var name = 'declarative';
var placeholder = '/* code */';
var filenames = [
    '../src/global.js',
    '../src/array.js','../src/isDOMElement.js',
    '../src/parseOptions.js','../src/getSpecifiedAttributes.js',
    '../src/mappings.js','../src/apply.js'
];

var fs = require('fs');

var license = fs.readFileSync('../LICENSE.txt') + '\n';
var code = '';
filenames.forEach(function(filename) { code += fs.readFileSync(filename) + '\n'; });
var universalModuleDefinition = fs.readFileSync('../src/universalModuleDefinition.js') + '';

var library = license + universalModuleDefinition.replace(placeholder, code);

fs.writeFileSync('../bin/' + name + '.js', library);

var exec = require('child_process').exec;
var command = 'java -jar compiler/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS ';
command += '--js=../bin/' + name + '.js ';
command += '--js_output_file=../bin/' + name + '.min.js';
exec(command);