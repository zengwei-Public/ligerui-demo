(function ($) {
    $.addButton = function (t) {
        var w = $(t).attr("width") ? $(t).attr("width") : "40px";
        var parent = $(t).parent().parent();
        $(t).wrap("<div class='iButton' width='" + (parseInt(w) + 10) + "px'><span></span></div>")
             .width(w)
             .hover(function () {
                 $(t).addClass("hover");
             }, function () {
                 $(t).removeClass("hover");
             });
    };
    var docloaded = false;
    $(document).ready(function () {
        docloaded = true
    });
    $.fn.button = function () {
        return this.each(function () {
            if (!docloaded) {
                var t = this;
                $(document).ready(function () {
                    $.addButton(t);
                });
            } else {
                $.addButton(this);
            }
        });
    }; //end textbox
})(jQuery);