(function() {

    var scripts = document.getElementsByTagName('script');
    var currentScriptTag = scripts[scripts.length - 1];

    var cssToInclude = [
        '../vendor/jasmine-1.1.0/jasmine.css'
    ];

    var scriptsToInclude = [
        '../vendor/jquery-1.7.js',
        '../vendor/jasmine-1.1.0/jasmine.js',
        '../vendor/jasmine-1.1.0/jasmine-html.js',
        '../vendor/jasmine-jquery-1.3.1.js'
    ];

    var i, output = '';

    for (i = 0; i < scriptsToInclude.length; i++) {
        output += '<script type="text/javascript" src="' + scriptsToInclude[i] + '"></script>';
    };

    for (i = 0; i < cssToInclude.length; i++) {
        output += '<link rel="stylesheet" type="text/css" href="' + cssToInclude[i] + '">';
    };

    document.write(output);

}());
