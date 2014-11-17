
//TMS页面封装
Namespace.register("TMS.Page");
TMS.Page.Data_ajax_SearchData = "Data_ajax_SearchData";

function AjaxError(xhr, status, error) {
    alert("异步调用出错，错误信息:\n" + status + "\n" + error);
}

function AjaxBegin_SearchList(xhr, settings) {
    var data = $("#Page_SearchList .search_condition form").data(TMS.Page.Data_ajax_SearchData);
    //如果不是点击搜索
    if (settings.data.indexOf("BtnSearch=") == -1) {
        if (data != undefined) {
            settings.data += "&" + data;
        } else {
      //      xhr.abort();
       //     $(":submit[name='BtnSearch']").click();
        }
    }
}

function AjaxComplete_SearchList(xhr, settings) {
    $(window).resize();
}

function OnChangePageSize(value, path, expires) {
    if (path == undefined) path = "/";
    if (expires == undefined) expires = 0;
    $.cookie('PageSize', value, { expires: expires, path: path });
    $(".toolbtn a.refresh").click();
}

var TabRandomNum = "";
//关闭当前Tab页面
function CloseCurrentTab() {
    TabRandomNum = parseInt(Math.random() * 100000000, 10);
    if (top.CloseTab) {
        top.CloseTab(TabRandomNum);
    }
}

//页面初始化构造
$(function () {
    $.ajaxSetup({
        cache: false,
        beforeSend: function (xhr) {
            $("#Loading").show();
         
        },
        complete: function (XHR, TS) {
            XHR = null;
            $("#Loading").hide();
        }
    });
    $(".CbxColumn .CheckAll").live("change", function () {
        var checked = $(this).attr("checked"); //        var $cbx = $(this).parents("table:eq(0)").find("tbody tr:visible .CbxColumn :checkbox");
        var $cbx = $(this).parents("table:eq(0)").find("tbody :checkbox");
        if (checked) {
            $cbx.attr("checked", "checked").change();
        } else {
            $cbx.removeAttr("checked").change();
        }
    });
    $("#Page_SearchList form[data-ajax=true]").live("submit", function () {
        $(this).data(TMS.Page.Data_ajax_SearchData, $(this).serialize());
    });
    $("#Page_SearchList .showsearch a").live("click", function () {
        $('.boxSearch').toggle();
        $(this).toggleClass('up');
        $(window).resize();
    });
    $(".DataTable tbody tr td:not('.CbxColumn,.unclick')").live("click", function () {
        var $dt = $(this).parents(".DataTable:eq(0)");
        var $tr = $(this).parents("tr:eq(0)");
        if ($dt.hasClass("SingleSelect")) {
            $("tbody .CbxColumn :checked", $dt).removeAttr("checked").change();
            $(".CbxColumn :checkbox", $tr).attr("checked", "checked").change();
        }
        if ($dt.hasClass("MultiSelect")) {
            $chk = $(".CbxColumn :checkbox", $tr);
            if ($chk.attr("checked")) {
                $chk.removeAttr("checked").change();
            }
            else {
                $chk.attr("checked", "checked").change();
            }
        }
    });
    $(".DataTable tbody tr td.CbxColumn input:checkbox").live("change", function () {
        var $tr = $(this).parents("tr:eq(0)");
        if ($(this).attr("checked")) {
            $tr.addClass("select");
        }
        else {
            $tr.removeClass("select");
        }
    });
    $(window).resize(function () {
        var iW = document.documentElement.clientWidth;
        var iH = document.documentElement.clientHeight;
        $("#Loading").height(iH).width(iW); //.css("line-height", iH + "px");
        if ($("#Page_SearchList").length > 0) {
            var searchHeight = $(".boxSearch").is(":visible") ? $(".boxSearch").height() : 0;
            var cutHeight = 128;//pagesplit height 25
            if ($.browser.msie && $.browser.version == "7.0") {
                cutHeight = 145;//pagesplit height 25
            }
            $(".tablelist").height(iH - searchHeight - cutHeight);
        }
    }).resize();

    //初始化查询条件
    var isReturn = unSerialize();
});


//获取表格选择项目
TMS.Page.GetDataTableChecked = function (elem) {
    var $DataTable = null;
    if (typeof (elem) == "undefined") {
        $DataTable = $(".DataTable");
    }
    else {
        $DataTable = $(elem);
    }

    return $(".CbxColumn :checked:not('.CheckAll')", $DataTable);
};
//检查已选择项
TMS.Page.CheckDataTableChecked = function (isNeedSingle) {
   
    if (typeof (isNeedSingle) == "undefined") {
        isNeedSingle = true;
    }
    var useYmPrompt = typeof ("ymPrompt") != "undefined";
    var arr = TMS.Page.GetDataTableChecked();
    if (arr.length == 0) {
        var msg = "请选择需要操作的项!";
        if (useYmPrompt) {
            ymPrompt.alert({ title: '提示', message: msg });
        } else {
            alert(msg);
        }
        return false;
    }
    else if (arr.length > 1 && isNeedSingle) {
        var msg = "只能选择需要操作的一项!";
        if (useYmPrompt) {
            ymPrompt.alert({ title: '提示', message: msg });
        } else {
            alert(msg);
        }
        return false;
    }
    return arr;
};
TMS.Page.Serialize = function (elemId, searchButtonId) {
 
    if (typeof (elemId) == "undefined" || elemId == "") {
        return;
    }
    var elem = $("#" + elemId);
    if (elem.length == 0) {
        return;
    }
    var url = document.location.href.split("?")[0];
    var value = {};
    elem.find("input:not(:button)").each(function () {
        eval("value." + $(this).attr('name') + "='" + $(this).val() + "'");
    });
    elem.find("select").each(function () {
        eval("value." + $(this).attr('name') + "='" + $(this).val() + "'");
    });
    if (value.length == 0) {
        return;
    }
    var obj = { url: url, elem: elemId, button: searchButtonId, value: value };
    for (var i = 0; i < top.PageSearchConditions.length; i++) {
        if (top.PageSearchConditions[i].url == url) {
            top.PageSearchConditions.splice(i, 1, obj);
            return;
        }
    }
    top.PageSearchConditions.push(obj);
};

function unSerialize() {
    if (typeof (top.PageSearchConditions) == "undefined" || top.PageSearchConditions.length == 0) {
        return false;
    }
    var url = document.location.href.split("?")[0];
    for (var i = 0; i < top.PageSearchConditions.length; i++) {
        if (top.PageSearchConditions[i].url == url) {
            if (top.PageSearchConditions[i] == null ||
            typeof (top.PageSearchConditions[i]) == "undefined") {
                top.PageSearchConditions.splice(i, 1);
                return false;
            }
            setValueToElement($("#" + top.PageSearchConditions[i].elem), top.PageSearchConditions[i].value);
            var btn = $("#" + top.PageSearchConditions[i].button);
            if (btn.length > 0) {
                btn.click();
            }
            top.PageSearchConditions.splice(i, 1);
            return true;
        }
    }
    return false;
}

function setValueToElement(elem, value) {
    if (typeof (elem) == "undefined" || elem.length == 0) {
        return;
    }
    if (typeof (value) == "undefined" || value.length == 0) {
        return;
    }
    for (var k in value) {
        var e = elem.find("[name='" + k + "']");
        if (e.length == 0) {
            continue;
        }
        e.val(value[k]);
    }
}

TMS.Page.ParseParamToUrl = function (elemId) {
    if (typeof (elemId) == "undefined" || elemId == "") {
        return "";
    }
    var elem = $("#" + elemId + " form");
    if (elem.length == 0) {
        return "";
    }
    return escape(elem.serialize());
};

function downloadfile() {
    var type = "help";
    var sysname = "物流管理系统TMS"; //
    var menuname =$(".tab_item2.tab_item2_selected", top.frames["mainFrame"].frames["main"].document).text();
    //encodeURI 解决中文乱码
    var path =encodeURI("/Shared/GetHelpFile?type=" + type + "&sysname=" + sysname + "&menuname=" + menuname);
    $("#ifrDownload").attr("src", path);
}
