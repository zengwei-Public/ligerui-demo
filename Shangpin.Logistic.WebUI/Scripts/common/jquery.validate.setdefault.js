$(function () {
    var settngs = $.data($('form')[0], 'validator').settings;
    settngs.errorPlacement = function (error, element) {
        var nextCell = element.parents("li:first").next("li").next("li");
        nextCell.find("div.l-exclamation").remove();
        $('<div class="l-exclamation" title="' + error.html() + '"></div>').appendTo(nextCell).ligerTip();
    }
    settngs.success = function (error) {
        var element = $("#" + error.attr("for"));
        var nextCell = element.parents("li:first").next("li").next("li");
        if (element.hasClass("l-textarea")) {
            element.removeClass("l-textarea-invalid");
        }
        else if (element.hasClass("l-text-field")) {
            element.parent().removeClass("l-text-invalid");
        }
        nextCell.find("div.l-exclamation").remove();
    }
});
