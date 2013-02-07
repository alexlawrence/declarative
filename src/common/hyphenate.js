var upperCaseRegex = new RegExp(/([A-Z])/g);

var hyphenate = function(input) {
    return input.replace(upperCaseRegex, function(completeMatch, character) {
        return '-' + character.toLowerCase();
    });
};

module.exports = hyphenate;