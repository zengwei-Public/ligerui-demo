﻿//获取QueryString的数组
function getQueryString() {
    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    if (result == null) {
        return "";
    }
    for (var i = 0; i < result.length; i++) {
        result[i] = result[i].substring(1);
    }
    return result;
}
//根据QueryString参数名称获取值
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
//根据QueryString参数索引获取值
function getQueryStringByIndex(index) {
    if (index == null) {
        return "";
    }
    var queryStringList = getQueryString();
    if (index >= queryStringList.length) {
        return "";
    }
    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}
(function ($) {
    //全局事件
    $(".l-dialog-btn").live('mouseover', function () {
        $(this).addClass("l-dialog-btn-over");
    }).live('mouseout', function () {
        $(this).removeClass("l-dialog-btn-over");
    });
    $(".l-dialog-tc .l-dialog-close").live('mouseover', function () {
        $(this).addClass("l-dialog-close-over");
    }).live('mouseout', function () {
        $(this).removeClass("l-dialog-close-over");
    });
    //搜索框 收缩/展开
    $(".searchtitle .togglebtn").live('click', function () {
        if ($(this).hasClass("togglebtn-down")) $(this).removeClass("togglebtn-down");
        else $(this).addClass("togglebtn-down");
        var searchbox = $(this).parent().nextAll("div.searchbox:first");
        searchbox.slideToggle('fast');
    });

    // 表单样式处理
    //var settngs = $.data($('form')[0], 'validator').settings;

    //var oldErrorFunction = settngs.errorPlacement;

    //var oldSucessFunction = settngs.success;

    //settngs.errorPlacement = function (error, element) {

    //    var nextCell = element.parents("li:first").next("li").next("li");
    //    nextCell.find("div.l-exclamation").remove();
    //    $('<div class="l-exclamation" title="' + error.html() + '"></div>').appendTo(nextCell).ligerTip();
    //}
    //settngs.success = function (error) {
    //    var element = $("#" + error.attr("for"));
    //    var nextCell = element.parents("li:first").next("li").next("li");
    //    if (element.hasClass("l-textarea")) {
    //        element.removeClass("l-textarea-invalid");
    //    }
    //    else if (element.hasClass("l-text-field")) {
    //        element.parent().removeClass("l-text-invalid");
    //    }
    //    nextCell.find("div.l-exclamation").remove();
    //}

    //
    

})(jQuery);
