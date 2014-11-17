//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.FocusView.js
// 实现元素集合对象的焦点项功能

/*
<FocusView Container="ElementId" BindBy="TAG|ID" Bindings="ElementIds|TagNames" Excludings="ElementId,...|TagIndex,..." Multiple="Boolean" DefaultClass="CssClass" OverClass="CssClass" ClickClass="CssClass" FocusClass="CssClass" FocusItems="ElementId,...|TagIndex,..." OnChange="String|Function"></FocusView>
*/

/// <global type="HashArray" elementType="FocusView">页面上定义的所有 FocusView 对象的集合</global>
document.focusViews = new Array();

FocusView = function() {
    /// <summary>FocusView 构造函数</summary>

    /// <value type="String|Element" mayBeNull="false">定义FocusView的作用元素</value>
    this.container = null;
    /// <value type="String" values="ID|TAG" defaultValue="ID">FocusView绑定到container的依据</value>
    this.bindBy = 'ID';

    /// <value type="String|Array" mayBeNull="false" elementType="String">FocusView项的ID集合或Tag路径</value>
    this.bindings = null;
    /// <value type="Array" elementType="Element">绑定项中例外的项</value>
    this.excludings = null;

    /// <value type="String" defaultValue="">项默认样式</value>
    this.defaultClass = '';
    /// <value type="String" defaultValue="defaultClass">项鼠标划过样式</value>
    this.overClass = '';
    /// <value type="String" defaultValue="overClass">项点击样式</value>
    this.clickClass = '';
    /// <value type="String" defaultValue="clickClass">项被选中样式</value>
    this.focusClass = '';

    /// <value type="Element">是否允许多选</value>
    this.multiple = false;

    /// <value type="Element">当前鼠标划过的项</value>
    this.overItem = null;
    /// <value type="Element|String">当前的焦点项</value>
    this.focusItem = null;
    /// <value type="Element|String">当前的焦点项</value>
    this.focusItems = new Array();
    /// <value name="target" type="Element">事件当前目标</value>
    this.target = null;

    /// <value type="Boolean">是否已经绑定到container</value>
    this.bound = false;
}

/// <value type="String|Function">绑定时触发, 支持return true|false;</value>
FocusView.prototype.onbind = null;
/// <value type="String|Function">取消绑定时触发, 支持return true|false;</value>
FocusView.prototype.onunbind = null;
/// <value type="String|Function">当焦点项改变后触发, 不支持return ture|false;</value>
FocusView.prototype.onchange = null;
/// <value type="String|Function">当点击右键时触发, 不支持return ture|false;</value>
FocusView.prototype.oncontextmenu = null;

/// <value type="Event">右键菜单临时变量, 用于showMenu方法</value>
FocusView.prototype.__event = null;

FocusView.prototype.over = function(target, ev) {
    /// <summary>项划过</summary>
    /// <param name="target" type="Element|String" defaultValue="this.target">将target设置为overItem</param>
    /// <param name="ev" type="EventArgs" defaultValue="null"></param>

    //使用此方法前必须绑定container成功
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }
        if (this.target != null) {
            //焦点项和当前划过项不能被划过
            if (this.overItem != this.target && !FocusView.__IsFocusItem(this, this.target)) {
                this.target.className = this.overClass;
                this.overItem = this.target;
            }
        }
    }
}

FocusView.prototype.click = function(target, ev) {
    /// <summary>设置点击项</summary>
    /// <param name="target" type="Element|String" mayBeNull="true" defaultValue="this.target">将target样式设置为clickClass</param>
    /// <param name="ev" type="EventArgs" mayBeNull="true" defaultValue="null"></param>
    //debugger
    //使用此方法前必须绑定container成功
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }

        if (this.target != null) {
            //焦点项不能被再次被点击
            if (!FocusView.__IsFocusItem(this, this.target)) {
                this.target.className = this.clickClass;
            }
        }
    }
}

FocusView.prototype.focus = function(target, ev) {
    /// <summary>设置焦点项</summary>
    /// <param name="target" type="Element|String" mayBeNull="true" defaultValue="this.target">将target设置为focusItem</param>
    /// <param name="ev" type="EventArgs" mayBeNull="true" defaultValue="null"></param>

    //使用此方法前必须绑定container成功
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }

        if (this.target != null) {
            var changed = true;
            if (this.multiple) {
                //多选

                if (FocusView.__CtrlKey(ev)) {
                    //按住了Ctrl
                    if (FocusView.__IsFocusItem(this, this.target)) {
                        //如果是焦点项, 取消选中
                        for (var i = 0; i < this.focusItems.length; i++) {
                            if (this.focusItems[i] == this.target) {
                                for (var j = i; j < this.focusItems.length; j++) {
                                    this.focusItems[j] = this.focusItems[j + 1];
                                }
                                break;
                            }
                        }
                        this.target.className = this.defaultClass;
                        this.focusItems.length--;
                        this.focusItem = this.focusItems[this.focusItems.length - 1];
                    }
                    else {
                        //如果不是焦点项, 选中
                        this.target.className = this.focusClass;
                        this.focusItem = this.target;
                        this.focusItems[this.focusItems.length] = this.target;
                    }
                }
                else {
                    //如果没有按住Ctrl键

                    if (FocusView.__IsFocusItem(this, this.target)) {
                        //如果已经是焦点项, 先取消其他的
                        if (this.focusItems.length > 1) {
                            for (var i = 0; i < this.focusItems.length; i++) {
                                if (this.focusItems[i] != this.target) {
                                    this.focusItems[i].className = this.defaultClass;
                                }
                            }
                            this.focusItems.length = 1;
                            this.focusItem = this.target;
                            this.focusItems[0] = this.target;
                        }
                        else {
                            changed = false;
                        }
                    }
                    else {
                        //如果不是选择项, 先取消选择所有的
                        for (var i = 0; i < this.focusItems.length; i++) {
                            this.focusItems[i].className = this.defaultClass;
                        }
                        //然后选中目标
                        this.focusItems.length = 1;
                        this.target.className = this.focusClass;
                        this.focusItem = this.target;
                        this.focusItems[0] = this.target;
                    }
                }
            }
            else {
                //单选

                if (FocusView.__CtrlKey(ev) && FocusView.__IsFocusItem(this, this.target)) {
                    //如果点击的已经选中的项, 取消选中
                    this.target.className = this.defaultClass;
                    this.focusItems.length = 0;
                    this.focusItem = null;
                }
                else if (!FocusView.__IsFocusItem(this, this.target)) {
                    //如果有其他选中项, 取消选择
                    if (this.focusItem != null) {
                        //当焦点项样式为focusClass时，才取消样式
                        if (this.focusItem.className == this.focusClass) this.focusItem.className = this.defaultClass;
                    }
                    //选中当前项
                    this.target.className = this.focusClass;
                    this.focusItem = this.target;
                    this.focusItems[0] = this.target;
                }
                else {
                    changed = false;
                }
            }

            //执行onchange事件
            if (changed) {
                this.__ExecuteEvent('onchange');
                /*
                if (this.onchange != null)
                {
                if (typeof(this.onchange) == 'function')
                {
                this.onchange(ev);
                }
                else if (typeof(this.onchange) == 'string')
                {
                var func;
                eval('func = function(){' + this.onchange + '}');
                func.call(this, ev);
                }
                }
                */
            }
        }
    }
}

FocusView.prototype.reset = function() {
    /// <summary>重置focusItem</summary>

    for (var i = 0; i < this.focusItems.length; i++) {
        this.focusItems[i].className = this.defaultClass;
    }

    this.focusItem = null;
    this.focusItems.length = 0;
    this.target = null;
}

FocusView.prototype.setFocus = function(items, focusClass) {
    /// <summary>设置一个或多个焦点项</summary>
    /// <param name="items" type="String|Array">将指定的一个或多个项设置为焦点项</param>

    if (this.bound) {
        if (focusClass == null) focusClass = this.focusClass;
        if (items != null) {
            if (typeof (items) == 'string') {
                items = items.split(',');
            }
            else if (!items instanceof Array) {
                items = [];
            }
        }
        else {
            items = [];
        }
        this.focusItems = [];
        //默认选中项不会触发onchange事件, 因为没有event对象
        for (var i = 0; i < items.length; i++) {
            if (typeof (items[i]) == 'string') {
                if (this.bindBy == 'ID') {
                    items[i] = document.getElementById(items[i]);
                }
                else if (this.bindBy == 'TAG') {
                    items[i] = FocusView.__GetTargetByTagIndex(this.container, items[i]);
                }
            }
            else if (!FocusView.__IsElement(items[i])) {
                items[i] = null;
            }
            if (items[i] != null) {
                this.focusItem = items[i];
                this.focusItem.className = focusClass;

                // 选中项
                if (this.multiple) {
                    this.focusItems[this.focusItems.length] = items[i];
                }
                else {
                    this.focusItems[0] = items[i];
                }
            }
        }
    }
}

FocusView.prototype.bind = function() {
    /// <summary>执行绑定</summary>

    //检查容器 container
    this.container = FocusView.__GetElement(this.container);

    //如果container不为null, 执行绑定
    if (this.container != null && FocusView.__ReturnEventValue(this, 'onbind')) {
        //标识已经绑定
        this.bound = true;

        //检查bindBy
        this.bindBy = this.bindBy.toUpperCase();
        if (this.bindBy != 'TAG' && this.bindBy != 'ID') this.bindBy = 'ID';

        //检查绑定元素 bindings
        if (this.bindings != null) {
            if (typeof (this.bindings) == 'string') {
                if (this.bindBy == 'ID') {
                    //bind by ID
                    this.bindings = this.bindings.split(',');
                }
                else if (this.bindBy == 'TAG') {
                    //bind by TAG
                    this.bindings = this.bindings.toUpperCase().split('.');
                }
            }
            else if (!this.bindings instanceof Array) {
                this.bindings = [];
            }
        }
        else {
            this.bindings = [];
        }

        //检查绑定例外 excludings
        if (this.excludings != null) {
            if (typeof (this.excludings) == 'string') {
                this.excludings = this.excludings.split(',');
            }
            else if (!this.excludings instanceof Array) {
                this.excludings = [];
            }
        }
        else {
            this.excludings = [];
        }
        //将字符串转化为Element
        for (var i = 0; i < this.excludings.length; i++) {
            if (typeof (this.excludings[i]) == 'string') {
                if (this.bindBy == 'ID') {
                    this.excludings[i] = document.getElementById(this.excludings[i]);
                }
                else {
                    this.excludings[i] = FocusView.__GetTargetByTagIndex(this.container, this.excludings[i]);
                }
            }
            else if (!FocusView.__IsElement(this.excludings[i])) {
                this.excludings[i] = null;
            }
        }
        //处理excludings的null项
        FocusView.__CleanArray(this.excludings);

        //处理tbody的问题
        if (this.bindBy == 'TAG') {
            for (var i = this.bindings.length - 1; i >= 0; i--) {
                if (this.bindings[i] == 'TR') {
                    //如果当前是数组第1项或者上一项的值不为TBODY, 增加一项'TBODY'
                    if (i == 0 || this.bindings[i - 1] != 'TBODY') {
                        this.bindings.length++;
                        for (var j = this.bindings.length - 1; j > i; j--) {
                            this.bindings[j] = this.bindings[j - 1];
                        }
                        this.bindings[i] = 'TBODY';
                    }
                }
            }
        }

        //defaultClass,overClass,clickClass,focusClass
        if (this.defaultClass == null) this.defaultClass = '';
        if (this.overClass == null) this.overClass = this.defaultClass;
        if (this.clickClass == null) this.clickClass = this.overClass;
        if (this.focusClass == null) this.focusClass = this.clickClass;

        //multiple			
        if (typeof (this.multiple) == 'string') {
            if (/^true$/i.test(this.multiple) || /^false$/i.test(this.multiple)) {
                this.multiple = this.multiple.toLowerCase();
            }
            this.multiple = eval(this.multiple);
        }
        if (this.multiple != true && this.multiple != false) this.multiple = false;

        //focusItems
        if (this.focusItems != null) {
            if (typeof (this.focusItems) == 'string') {
                this.focusItems = this.focusItems.split(',');
            }
            else if (!this.focusItems instanceof Array) {
                this.focusItems = [];
            }
        }
        else {
            this.focusItems = [];
        }
        this.setFocus(this.focusItems);
        //		var focusItems = this.focusItems;
        //		this.focusItems = [];			
        //		//默认选中项不会触发onchange事件, 因为没有event对象
        //		for (var i=0; i<focusItems.length; i++)
        //		{				
        //			if (typeof(focusItems[i]) == 'string')
        //			{
        //				if (this.bindBy == 'ID')
        //				{
        //					focusItems[i] = document.getElementById(focusItems[i]);
        //				}
        //				else if (this.bindBy == 'TAG')
        //				{
        //					focusItems[i] = FocusView.__GetTargetByTagIndex(this.container, focusItems[i]);
        //				}
        //			}
        //			else if (!FocusView.__IsElement(focusItems[i]))
        //			{
        //				focusItems[i] = null;
        //			}
        //			if (focusItems[i] != null)
        //			{					
        //				this.focusItem = focusItems[i];
        //				this.focusItem.className = this.focusClass;
        //				
        //				// 选中项
        //				if (this.multiple)
        //				{
        //					this.focusItems[this.focusItems.length] = focusItems[i];
        //				}
        //				else
        //				{
        //					this.focusItems[0] = focusItems[i];
        //				}
        //			}
        //		}			

        //添加事件
        var focusView = this;
        //鼠标移动事件
        focusView.container.onmousemove = function(ev) {
            focusView.over(FocusView.__GetTargetByEvent(focusView, ev), ev);
        }
        //鼠标划出事件
        focusView.container.onmouseout = function(ev) {
            if (focusView.overItem != null) {
                focusView.overItem.className = (focusView.overItem == focusView.focusItem ? focusView.focusClass : focusView.defaultClass);
                focusView.overItem = null;
                focusView.target = null;
            }
        }
        //鼠标键按下事件
        focusView.container.onmousedown = function(ev) {
            if (FocusView.__LeftButton(ev)) {
                focusView.click(FocusView.__GetTargetByEvent(focusView, ev), ev);
            }
        }
        //鼠标键按起事件
        focusView.container.onmouseup = function(ev) {
            if (FocusView.__LeftButton(ev)) {
                focusView.focus(FocusView.__GetTargetByEvent(focusView, ev), ev);
            }
        }
        //鼠标右键事件		
        focusView.container.oncontextmenu = function(ev) {
            if (focusView.oncontextmenu != null) {
                ev = ev || window.event;
                focusView.__event = ev;
                focusView.focus(FocusView.__GetTargetByEvent(focusView, ev), ev);
                focusView.__ExecuteEvent('oncontextmenu', focusView.focusItem);

                return false;
            }
        }

        //保存到全局变量
        document.focusViews[focusView.container.id] = focusView;
    }
}

FocusView.prototype.unbind = function() {
    /// <summary>取消已有的绑定</summary>

    if (this.bound && FocusView.__ReturnEventValue(this, 'onunbind')) {
        //取消事件绑定
        if (this.container != null) {
            this.container.onmousemove = null;
            this.container.onmouseout = null;
            this.container.onmousedown = null;
            this.container.onmouseup = null;
        }
        //设定绑定标志为false
        this.bound = false;
        //取消全局变量
        delete document.focusViews[this.id];
    }
}

FocusView.prototype.showMenu = function(menuName) {
    /// <summary>显示右键菜单</summary>
    document.menus[menuName].show(this.__event);
}

FocusView.prototype.__ExecuteEvent = function(eventName, argument) {
    /// <summary>执行事件</summary>

    if (this[eventName] != null) {
        if (typeof (this[eventName]) == 'function') {
            this[eventName](argument);
        }
        else if (typeof (this[eventName]) == 'string') {
            var ev;
            eval('ev = function(){' + this[eventName] + '}');
            ev.call(this, argument);
        }
    }
}

FocusView.__ReturnEventValue = function(focusView, eventName, ev) {
    /// <summary>执行事件并返回值</summary>
    /// <param name="focusView" type="FocusView">FocusView对象</>
    /// <param name="eventName" type="String">事件名</param>
    /// <param name="ev">事件对象</param>
    /// <returns>布尔值</returns>

    var returnValue = true;
    if (focusView[eventName] != null) {
        if (typeof (focusView[eventName]) == 'function') {
            returnValue = focusView[eventName](ev);
        }
        else if (typeof (focusView[eventName]) == 'string') {
            eval('returnValue = function(){' + focusView[eventName] + '}');
            returnValue = returnValue.call(focusView, ev);
        }
        if (returnValue != false && returnValue != true) returnValue = true;
    }
    return returnValue;
}

FocusView.__GetTargetByEvent = function(focusView, ev) {
    /// <summary>根据事件得到对象</summary>
    /// <param name="focusView" type="FocusView">FocusView对象</param>
    /// <param name="ev" type="EventArgs">鼠标事件</param>
    /// <returns type="Element">当前目标对象</returns>

    ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    return focusView.bindBy == 'ID' ? FocusView.__GetTargetById(focusView.container, focusView.bindings, target) : FocusView.__GetTargetByTagName(focusView.container, focusView.bindings, target);
}

FocusView.__GetTarget = function(focusView, target) {
    /// <summary>判断目标, 用于over, click, focus方法</summary>

    if (typeof (target) == 'string') {
        if (focusView.bindBy == 'ID') {
            target = document.getElementById(target);
        }
        else {
            target = FocusView.__GetTargetByTagIndex(focusView.container, target);
        }
    }
    else if (!FocusView.__IsElement(target)) {
        target = null;
    }

    //检查绑定例外
    if (target != null) {
        for (var i = 0; i < focusView.excludings.length; i++) {
            if (target == focusView.excludings[i]) {
                target = null;
                break;
            }
        }
    }

    return target;
}

FocusView.__GetElement = function(element) {
    /// <summary>判断元素</summary>
    if (typeof (element) == 'string') {
        if ($(".GridView")) {
            element = $(".GridView")[0];
        }
    }
    if (!FocusView.__IsElement(element)) {
        element = null;
    }
    return element;
}

FocusView.__IsElement = function(element) {
    /// <summary>判断对象是不是元素</summary>
    if (element != null) {
        return (element.nodeType != undefined && element.nodeName != undefined);
    }
    else {
        return false;
    }
}

FocusView.__IsFocusItem = function(focusView, target) {
    /// <summary>判断对象是不是焦点对象</summary>

    var isFocusItem = false;
    if (FocusView.__IsElement(target)) {
        for (var i = 0; i < focusView.focusItems.length; i++) {
            if (focusView.focusItems[i] == target) {
                isFocusItem = true;
                break;
            }
        }
    }
    return isFocusItem;
}

FocusView.__CtrlKey = function(ev) {
    /// <summary>检查是不是按着Ctrl键</summary>

    ev = ev || window.event;
    if (ev != null) {
        return ev.ctrlKey;
    }
    else {
        return false;
    }
}

FocusView.__LeftButton = function(ev) {
    /// <summary>检查是不是按的鼠标左键</summary>
    ev = ev || window.event;
    if (ev != null) {
        return ev.button == 0 || ev.button == 1;
    }
    else {
        return false;
    }
}

FocusView.__CleanArray = function(array) {
    /// <summary>清理数组中的null和undefined项</summary>

    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] == null || array[i] == undefined) {
            for (var j = i; j < array.length; j++) {
                array[j] = array[j + 1];
            }
            array.length--;
        }
    }
}

FocusView.__GetTargetByTagIndex = function(container, values) {
    /// <summary>
    ///		当bindBy == 'TAG' 时, 根据序列初始值得到对象, 用于初始化focusItems,  支持 n (最后一项)
    /// </summary>
    /// <param name="container" type="Element">从container开始检查的对象<param>
    /// <param name="values" type="String|Array" elementType="String">绑定对象的Index字符串或字符串数组(.分隔), 索引忽略TBODY<param>
    /// <returns type="Element"></returns>

    //如果不是数组, 拆成数组
    if (!(values instanceof Array)) {
        if (typeof (values) == 'string') {
            values = values.split('.');
        }
        else {
            values = [];
        }
    }

    if (values.length == 0) {
        return null;
    }
    else {
        //如果是'TBODY', 检查下一项
        if (container.lastChild.nodeName == 'TBODY') {
            return FocusView.__GetTargetByTagIndex(container.lastChild, values);
        }
        else {
            var tagNodes = new Array();

            //遍历<tag>标签
            for (var i = 0; i < container.childNodes.length; i++) {
                if (container.childNodes[i].nodeType == 1) {
                    tagNodes[tagNodes.length] = container.childNodes[i];
                }
            }

            var n = tagNodes.length - 1;
            var index = eval(values[0]);

            //如果设定值小于0, 设定为0
            if (index < 0) index = 0;
            //如果设定值超过节点总数, 选定最后一个节点
            if (index > n) index = n;

            //如果不是最后一项,继续向下找
            if (values.length > 1) {
                //从values中去掉第一项
                for (var j = 0; j < values.length - 1; j++) {
                    values[j] = values[j + 1];
                }
                values.length--;

                return FocusView.__GetTargetByTagIndex(tagNodes[index], values);
            }
            //如果是最后一项, 返回
            else {
                return tagNodes[index];
            }
        }
    }
}

FocusView.__GetTargetById = function(container, bindings, target) {
    /// <summary>根据id得到对象</summary>
    /// <param name="container" type="Element">FocusView 容器<param>
    /// <param name="bindings" type="Array" elementType="String">绑定对象的ID数组<param>
    /// <param name="target" type="Element">检查的目标<param>
    /// <returns type="Element"></returns>

    if (target != null && target != container) {
        var isBinding = false;

        if (target.id != '') {
            //检查目标对象是否在bindings中
            for (var i = 0; i < bindings.length; i++) {
                if (new RegExp(bindings[i]).test(target.id)) {
                    isBinding = true;
                    break;
                }
            }
        }

        if (isBinding) {
            return target;
        }
        else {
            if (target.parentNode != container) {
                return FocusView.__GetTargetById(container, bindings, target.parentNode);
            }
            else {
                return null;
            }
        }
    }
    else {
        return null;
    }
};

FocusView.__GetTargetByTagName = function(container, bindings, target) {
    /// <summary>根据tagName得到对象</summary>
    /// <param name="container" type="Element">FocusView 容器<param>
    /// <param name="bindings" type="Array" elementType="String">绑定对象的索引数组<param>
    /// <param name="target" type="Element">检查的目标<param>
    /// <returns type="Element"></returns>

    if (target != null && target != container) {
        if (target.nodeName == bindings[bindings.length - 1]) {
            var isBinding = true;
            var currentNode = target;

            //遍历bindings, 检查target及target的各级父节点nodeName是否与bindings的各项匹配
            for (var i = bindings.length - 1; i >= 0; i--) {
                if (currentNode.nodeName != bindings[i]) {
                    isBinding = false;
                    break;
                }
                currentNode = currentNode.parentNode;
            }
            //检查currentNode是不是container
            if (isBinding) {
                if (currentNode != container) {
                    isBinding = false;
                }
            }

            if (isBinding) {
                return target;
            }
            else {
                if (target.parentNode != container) {
                    return FocusView.__GetTargetByTagName(container, bindings, target.parentNode);
                }
                else {
                    return null;
                }
            }
        }
        else {
            return FocusView.__GetTargetByTagName(container, bindings, target.parentNode);
        }
    }
    else {
        return null;
    }
};

function __InitializeFocusViews() {
    /// <summary>初始化页面所有FocusView</summary>

    //初始化页面<FocusView>标记
    var focusViews = document.getElementsByTagName('FocusView');
    var focusView;
    for (var i = 0; i < focusViews.length; i++) {
        focusView = new FocusView();
        focusView.container = focusViews[i].getAttribute('container');
        focusView.bindBy = focusViews[i].getAttribute('bindby');
        focusView.bindings = focusViews[i].getAttribute('bindings');
        focusView.excludings = focusViews[i].getAttribute('excludings');
        focusView.multiple = focusViews[i].getAttribute('multiple');
        focusView.defaultClass = focusViews[i].getAttribute('defaultClass');
        focusView.overClass = focusViews[i].getAttribute('overClass');
        focusView.clickClass = focusViews[i].getAttribute('clickClass');
        focusView.focusClass = focusViews[i].getAttribute('focusClass');
        focusView.focusItems = focusViews[i].getAttribute('focusItems');
        focusView.onbind = focusViews[i].getAttribute('onbind');
        focusView.onunbind = focusViews[i].getAttribute('onunbind');
        focusView.onchange = focusViews[i].getAttribute('onchange');
        focusView.oncontextmenu = focusViews[i].getAttribute('oncontextmenu');
        focusView.bind();
    }
};
__InitializeFocusViews();