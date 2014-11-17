(function ($) {
    $.fn.watermark = function (defaultText) {
        return this.each(function () {
            var $this = $(this);
            var ispwd = $this.attr("type").toLowerCase() == "password";
            var text = $this.val();
            if (defaultText) {
                text = defaultText;
                if (ispwd) {
                    var tb = $("<input type='text' class='textbox'/>");
                    $this.hide().after(tb).next().addClass("watermark").width($this.width()).val(text);
                } else {
                    $this.val(text).addClass("watermark");
                }
            }
            if (ispwd) {
                $this.next().focus(function () {
                    if ($this.next().val() == defaultText) {
                        $this.next().hide().end().show().focus();
                    }
                }).end().blur(function () {
                    if ($this.val() == '') {
                        $this.hide().next().show();
                    } 
                });
            } else {
                $this.focus(function () {
                    if ($this.val() == defaultText) {
                        $this.val('').removeClass("watermark");
                    } 
                }).blur(function () {
                    if ($this.val() == '') {
                        $this.val(defaultText).addClass("watermark");
                    } 
                });
            } 
        });
    } 
})(jQuery);
