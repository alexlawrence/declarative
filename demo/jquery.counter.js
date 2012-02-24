(function($) {

    'use strict';

    $.fn.counter = function(options) {
        this.each(function() {
            var label = this;
            $(options.target).keyup(function() {
                $(label).text($(this).val().length);
            });
        });
    }

}(jQuery));