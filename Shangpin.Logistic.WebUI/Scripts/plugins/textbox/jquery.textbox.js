(function ($) {
    $.addTextBox = function (t, p) {
        p = $.extend({
            label: $(t).attr("label"),
            watermarktext: $(t).attr("watermark"),
            dateSkin: "blue",
            dateFormat: 'yyyy-MM-dd HH:mm:ss',
            defaultWidth: "164px"
        }, p);
        var w = $(t).attr("width") ? $(t).attr("width") : p.defaultWidth;
        $(t).wrap('<div class="aq_box"></div>')
            .width(w)
            .parent()
            .hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            });
        var span = $.trim(p.label);
        if (span != "") {
            $(t).parent().before("<label class='span' for='" + $(t).attr("id") + "'>" + span + "</label>");
        }
        //添加图标公用方法
        function addIcon(settings) {
            var r = $.extend({
                iconCssType: "",
                eventName: "focus",
                title: "",
                handler: null,
                readonly: false
            }, settings);
            if ($(t).hasClass(r.iconCssType)) {
                $(t).after("<span class='ui-icon-" + r.iconCssType + "' title='" + r.title +
                           "' style='left:" + (parseInt(w) - 14) + "px;left:" + (parseInt(w) - 11) + "px\9'></span>")
                .attr("readonly", r.readonly)
                .bind(r.eventName, r.handler);
            }
        }
        //切割字符串
        function split(thisObj) {
            var maxLength = thisObj.attr("maxLength");
            if (maxLength) {
                var val = String($.trim(thisObj.val()));
                var len = val.length;
                if (len > maxLength) {
                    thisObj.attr("title", thisObj.val())
                           .val($.trim(thisObj.val()).substring(0, maxLength) + "...")
                           .tooltip();
                } else {
                    thisObj.removeAttr("title")
                           .val(thisObj.val())
                           .unbind("hover");
                }
            }
        }
        //加上日历图标
        addIcon({
            iconCssType: "date",
            handler: function () {
                WdatePicker({ skin: p.dateSkin, minDate: '#F{$dp.$D(\'txtStart\',{d:1});}', dateFmt: p.dateFormat });
                $(t).next().focus();
            },
            title: "选择日期"
        });
        //加上下拉图标
        addIcon({
            iconCssType: "drop",
            iconPath: p.dropIconPath,
            eventName: "click",
            handler: function () {
                ymPrompt.win({ message: '/Tree/ShowTree', width: 350, height: 480, title: '选择' + p.label,
                    handler: function (tp, data) {
                        if (tp == "SelectTreeNode") {
                            $(t).val(data.text).parent().next().val(data.id);
                            split($(t));
                            if ($(t).val() != p.watermarktext) {
                                $(t).removeClass("watermark");
                            }
                        }
                    }, maxBtn: false, minBtn: false, iframe: true
                });
            },
            title: "选择" + p.label,
            readonly: "readonly"
        });
        //加上搜索图标
        addIcon({
            iconCssType: "search",
            iconPath: p.searchIconPath,
            eventName: "click",
            handler: function () {
                //                $(t).autocomplete({
                //                    url: '/Tree/GetCompanyNames'
                //                });
            }
        });
        //加邮件自动提示
        addIcon({
            iconCssType: "mail",
            iconPath: p.mailIconPath,
            handler: function () {
            }
        });
        //加水印
        var watermarktext = $.trim(p.watermarktext);
        if (watermarktext != "") {
            $(t).watermark(watermarktext);
        }
        //加提示
        var tooltip = $.trim($(t).attr("title"));
        if ($(t).attr("title") && tooltip != "") {
            $(t).tooltip(tooltip);
        }
    };
    var docloaded = false;
    $(document).ready(function () {
        docloaded = true
    });
    $.fn.textbox = function (p) {
        return this.each(function () {
            if (!docloaded) {
                var t = this;
                $(document).ready(function () {
                    $.addTextBox(t, p);
                });
            } else {
                $.addTextBox(this, p);
            }
        });
    }; //end textbox
})(jQuery);