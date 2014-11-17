//JS模拟Request.QueryString()
var Request = {
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "\=([^\&\?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
}

String.prototype.lTrim = function (s) {
    s = (s ? s : "\\s");                            //没有传入参数的，默认去空格
    s = ("(" + s + ")");
    var reg_lTrim = new RegExp("^" + s + "*", "g");     //拼正则
    return this.replace(reg_lTrim, "");
};

String.prototype.rTrim = function (s) {
    s = (s ? s : "\\s");
    s = ("(" + s + ")");
    var reg_rTrim = new RegExp(s + "*$", "g");
    return this.replace(reg_rTrim, "");
};

String.prototype.trim = function (s) {
    s = (s ? s : "\\s");
    s = ("(" + s + ")");
    var reg_trim = new RegExp("(^" + s + "*)|(" + s + "*$)", "g");
    return this.replace(reg_trim, "");
};

String.prototype.startWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}

String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

// 声明一个全局对象Namespace，用来注册命名空间
Namespace = new Object();
// 全局对象仅仅存在register函数，参数为名称空间全路径，如"Grandsoft.GEA"
Namespace.register = function (fullNS) {
    // 将命名空间切成N部分, 比如Grandsoft、GEA等
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        // 依次创建构造命名空间对象（假如不存在的话）的语句
        // 比如先创建Grandsoft，然后创建Grandsoft.GEA，依次下去
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
    }
    if (sEval != "") eval(sEval);
}

//居中弹出窗体
function openWindow(url, name, iWidth, iHeight) {
    var url; //转向网页的地址;
    var name; //网页名称，可为空;
    var iWidth; //弹出窗口的宽度;
    var iHeight; //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
}

function round(v, e) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
}

Number.prototype.formatNumber = function (e) {
    var arr = (this + ".").split(".");
    if (arr[1].length > e) {
        arr[1] = round(arr[1], e);
    }
    else {
        var length = e - arr[1].length;
        for (var i = 0; i < length; i++) {
            arr[1] += "0";
        }
    }
    return arr[0] + "." + arr[1];
}
//播放正确操作的提示音
function SucceessNotice() {
    try {
        $("#SucceessWav")[0].controls.stop();
        $("#SucceessWav")[0].controls.play();
    }
    catch (e)
     { }
 }
//播放错误操作的提示音
function ErrorNotice() {
    try {
        $("#ErrorWav")[0].controls.stop();
        $("#ErrorWav")[0].controls.play();
    }
    catch (e)
      { }
  }

  function playSound(type) {
      var musicURL = "";
      if (type == 'error') {
          var failname = $.cookie('fail');
          if(failname == null) {
              ErrorNotice();
              return;
          } 
          else {
               musicURL = "/Content/media/error/"+failname;
          }
         
      }
       else {
           var succname = $.cookie('succ');
           if (succname == null) {
               SucceessNotice();
               return;
           }
           else {
               musicURL = "/Content/media/Done/" + succname;
           }       
      }
      $("#sound")[0].URL = musicURL;
      $("#sound")[0].controls.stop();
      $("#sound")[0].controls.play();
    
}

function fnOpenModalDialog(url, width, height) {
    window.showModalDialog(url, window, "dialogWidth=" + width + "px;dialogHeight=" + height + "px;center:yes;resizable:no;scroll:auto;help=no;location=no;status=no;");
}