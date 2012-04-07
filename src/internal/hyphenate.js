(function(){

    internal.hyphenate = function(input) {
        return input.replace(upperCaseRegex, function(completeMatch, character) {
            return '-' + character.toLowerCase();
        });
    };

    var upperCaseRegex = new RegExp(/([A-Z])/g);

}());