var config = require('./config.js');
var fs = require('fs');

var license = fs.readFileSync(config.licensePath) + '\n';
var code = '';
config.filenames.forEach(function(filename) { code += fs.readFileSync(filename) + '\n'; });
var universalModuleDefinition = fs.readFileSync(config.universalModuleDefinitionPath) + '';

code = universalModuleDefinition.replace(/_code/g, code);
code = code.replace(/_globalName/g, 'root.' + config.name);
code = code.replace(/_localName/g, config.name);
code = code.replace(/_version/g, "'" + config.version + "'");

license = license.replace(/_version/g, "'" + config.version + "'");

var library = license + code;

fs.writeFileSync('../bin/' + config.name + '.js', library);

var exec = require('child_process').exec;
var command = 'java -jar compiler/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS ';
command += '--js=../bin/' + config.name + '.js ';
command += '--js_output_file=../bin/' + config.name + '.min.js';
exec(command);