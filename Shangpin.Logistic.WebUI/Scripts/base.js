//删除元素
Array.prototype.del = function (n) {
    if (n < 0) return this;
    return this.slice(0, n).concat(this.slice(n + 1, this.length));
}
// 数组洗牌 
Array.prototype.random = function () {
    var nr = [], me = this, t;
    while (me.length > 0) {
        nr[nr.length] = me[t = Math.floor(Math.random() * me.length)];
        me = me.del(t);
    }
    return nr;
}
// 数字数组排序 
Array.prototype.sortNum = function (f) {
    if (!f) f = 0;
    if (f == 1) return this.sort(function (a, b) { return b - a; });
    return this.sort(function (a, b) { return a - b; });
}
// 获得数字数组的最大项 
Array.prototype.getMax = function () {
    return this.sortNum(1)[0];
}
// 获得数字数组的最小项 
Array.prototype.getMin = function () {
    return this.sortNum(0)[0];
}
// 数组第一次出现指定元素值的位置 
Array.prototype.indexOf = function (o) {
    for (var i = 0; i < this.length; i++) if (this[i] == o) return i;
    return -1;
}
// 移除数组中重复的项 
Array.prototype.removeRepeat = function () {
    this.sort();
    var rs = [];
    var cr = false;
    for (var i = 0; i < this.length; i++) {
        if (!cr) cr = this[i];
        else if (cr == this[i]) rs[rs.length] = i;
        else cr = this[i];
    }
    var re = this;
    for (var i = rs.length - 1; i >= 0; i--) re = re.del(rs[i]);
    return re;
}

function include() {
    //DEBUG版
    //	for (var i = 0; i < arguments.length; i++) {
    //		var file = arguments[i];
    //		if (file.match(/\.js$/i))
    //			document.write('<script type=\"text/javascript\" src=\"' + file + "\?r=" + Math.random() + '\"></sc' + 'ript>');
    //		else
    //			document.write('<style type=\"text/css\">@import \"' + file + "\?r=" + Math.random() + '\" ;</style>');
    //	}
    //RELEASE版
    for (var i = 0; i < arguments.length; i++) {
        var file = arguments[i];
        if (file.match(/\.js$/i))
            document.write('<script type=\"text/javascript\" src=\"' + file + '\"></sc' + 'ript>');
        else
            document.write('<style type=\"text/css\">@import \"' + file + '\" ;</style>');
    }
};
//动态加载脚本
//(function() {
//	if (!Array.prototype.contains) Array.prototype.contains = function(item) {
//		return RegExp("(^|,)" + item.toString() + "($|,)").test(this);
//	}
//	getFiles = function(tag, attr) {
//		var result = [];
//		var files = document.getElementsByTagName(tag);
//		for (var i = 0; i < files.length; i++) {
//			if (!files[i].getAttribute(attr)) continue;
//			var position = files[i].getAttribute(attr).lastIndexOf("?") > -1 ? files[i].getAttribute(attr).lastIndexOf("?") : files[i].getAttribute(attr).length;
//			result.push(files[i].getAttribute(attr).substring(0, position));
//		}
//		return result;
//	}
//	includeFile = function(url, text) {
//		var files = [];
//		var head = document.getElementsByTagName("head").item(0);
//		var elem = null;
//		if (url.match(/\.js$/i)) {
//			var scripts = getFiles("script", "src");
//			if (!scripts.contains(url)) {
//				elem = document.createElement("script");
//				elem.type = "text/javascript";
//				elem.defer = true;
//				elem.src = url;
//			}
//		} else {
//			var cssFiles = getFiles("link", "href");
//			if (!cssFiles.contains(url)) {
//				elem = document.createElement("link");
//				elem.type = "text/css";
//				elem.href = url;
//				elem.rel = "stylesheet";
//			}
//		}
//		if (elem) head.appendChild(elem);
//	}
//	include = function() {
//		for (var i = 0; i < arguments.length; i++) {
//			includeFile(arguments[i]);
//		}
//	}
//})();
