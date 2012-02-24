(function(module) {

    // based on: http://msdn.microsoft.com/en-us/library/ms537509%28v=vs.85%29.aspx
    module.versionOfInternetExplorer = function() {
        var version = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
              version = parseFloat( RegExp.$1 );
            }
        }
        return version;
    }

}(declarative));