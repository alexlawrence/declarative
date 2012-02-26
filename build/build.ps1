$files = "../LICENSE.txt","../src/declarative.js","../src/versionOfInternetExplorer.js"
$files += "../src/array.js","../src/parseOptions.js","../src/mappings.js","../src/apply.js"

$compilerCommand = "java -jar compiler/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS"
foreach ($file in $files)
{
    $compilerCommand += " --js=" + $file
}
$compilerCommand += " --js_output_file=../bin/declarative.min.js"

cat $files | out-file -encoding ASCII ../bin/declarative.js
Invoke-Expression $compilerCommand
