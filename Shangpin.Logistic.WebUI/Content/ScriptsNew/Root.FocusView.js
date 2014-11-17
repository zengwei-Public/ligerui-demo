//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.FocusView.js
// ʵ��Ԫ�ؼ��϶���Ľ������

/*
<FocusView Container="ElementId" BindBy="TAG|ID" Bindings="ElementIds|TagNames" Excludings="ElementId,...|TagIndex,..." Multiple="Boolean" DefaultClass="CssClass" OverClass="CssClass" ClickClass="CssClass" FocusClass="CssClass" FocusItems="ElementId,...|TagIndex,..." OnChange="String|Function"></FocusView>
*/

/// <global type="HashArray" elementType="FocusView">ҳ���϶�������� FocusView ����ļ���</global>
document.focusViews = new Array();

FocusView = function() {
    /// <summary>FocusView ���캯��</summary>

    /// <value type="String|Element" mayBeNull="false">����FocusView������Ԫ��</value>
    this.container = null;
    /// <value type="String" values="ID|TAG" defaultValue="ID">FocusView�󶨵�container������</value>
    this.bindBy = 'ID';

    /// <value type="String|Array" mayBeNull="false" elementType="String">FocusView���ID���ϻ�Tag·��</value>
    this.bindings = null;
    /// <value type="Array" elementType="Element">�������������</value>
    this.excludings = null;

    /// <value type="String" defaultValue="">��Ĭ����ʽ</value>
    this.defaultClass = '';
    /// <value type="String" defaultValue="defaultClass">����껮����ʽ</value>
    this.overClass = '';
    /// <value type="String" defaultValue="overClass">������ʽ</value>
    this.clickClass = '';
    /// <value type="String" defaultValue="clickClass">�ѡ����ʽ</value>
    this.focusClass = '';

    /// <value type="Element">�Ƿ������ѡ</value>
    this.multiple = false;

    /// <value type="Element">��ǰ��껮������</value>
    this.overItem = null;
    /// <value type="Element|String">��ǰ�Ľ�����</value>
    this.focusItem = null;
    /// <value type="Element|String">��ǰ�Ľ�����</value>
    this.focusItems = new Array();
    /// <value name="target" type="Element">�¼���ǰĿ��</value>
    this.target = null;

    /// <value type="Boolean">�Ƿ��Ѿ��󶨵�container</value>
    this.bound = false;
}

/// <value type="String|Function">��ʱ����, ֧��return true|false;</value>
FocusView.prototype.onbind = null;
/// <value type="String|Function">ȡ����ʱ����, ֧��return true|false;</value>
FocusView.prototype.onunbind = null;
/// <value type="String|Function">��������ı�󴥷�, ��֧��return ture|false;</value>
FocusView.prototype.onchange = null;
/// <value type="String|Function">������Ҽ�ʱ����, ��֧��return ture|false;</value>
FocusView.prototype.oncontextmenu = null;

/// <value type="Event">�Ҽ��˵���ʱ����, ����showMenu����</value>
FocusView.prototype.__event = null;

FocusView.prototype.over = function(target, ev) {
    /// <summary>���</summary>
    /// <param name="target" type="Element|String" defaultValue="this.target">��target����ΪoverItem</param>
    /// <param name="ev" type="EventArgs" defaultValue="null"></param>

    //ʹ�ô˷���ǰ�����container�ɹ�
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }
        if (this.target != null) {
            //������͵�ǰ������ܱ�����
            if (this.overItem != this.target && !FocusView.__IsFocusItem(this, this.target)) {
                this.target.className = this.overClass;
                this.overItem = this.target;
            }
        }
    }
}

FocusView.prototype.click = function(target, ev) {
    /// <summary>���õ����</summary>
    /// <param name="target" type="Element|String" mayBeNull="true" defaultValue="this.target">��target��ʽ����ΪclickClass</param>
    /// <param name="ev" type="EventArgs" mayBeNull="true" defaultValue="null"></param>
    //debugger
    //ʹ�ô˷���ǰ�����container�ɹ�
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }

        if (this.target != null) {
            //������ܱ��ٴα����
            if (!FocusView.__IsFocusItem(this, this.target)) {
                this.target.className = this.clickClass;
            }
        }
    }
}

FocusView.prototype.focus = function(target, ev) {
    /// <summary>���ý�����</summary>
    /// <param name="target" type="Element|String" mayBeNull="true" defaultValue="this.target">��target����ΪfocusItem</param>
    /// <param name="ev" type="EventArgs" mayBeNull="true" defaultValue="null"></param>

    //ʹ�ô˷���ǰ�����container�ɹ�
    if (this.bound) {
        if (target != null) {
            this.target = FocusView.__GetTarget(this, target);
        }

        if (this.target != null) {
            var changed = true;
            if (this.multiple) {
                //��ѡ

                if (FocusView.__CtrlKey(ev)) {
                    //��ס��Ctrl
                    if (FocusView.__IsFocusItem(this, this.target)) {
                        //����ǽ�����, ȡ��ѡ��
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
                        //������ǽ�����, ѡ��
                        this.target.className = this.focusClass;
                        this.focusItem = this.target;
                        this.focusItems[this.focusItems.length] = this.target;
                    }
                }
                else {
                    //���û�а�סCtrl��

                    if (FocusView.__IsFocusItem(this, this.target)) {
                        //����Ѿ��ǽ�����, ��ȡ��������
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
                        //�������ѡ����, ��ȡ��ѡ�����е�
                        for (var i = 0; i < this.focusItems.length; i++) {
                            this.focusItems[i].className = this.defaultClass;
                        }
                        //Ȼ��ѡ��Ŀ��
                        this.focusItems.length = 1;
                        this.target.className = this.focusClass;
                        this.focusItem = this.target;
                        this.focusItems[0] = this.target;
                    }
                }
            }
            else {
                //��ѡ

                if (FocusView.__CtrlKey(ev) && FocusView.__IsFocusItem(this, this.target)) {
                    //���������Ѿ�ѡ�е���, ȡ��ѡ��
                    this.target.className = this.defaultClass;
                    this.focusItems.length = 0;
                    this.focusItem = null;
                }
                else if (!FocusView.__IsFocusItem(this, this.target)) {
                    //���������ѡ����, ȡ��ѡ��
                    if (this.focusItem != null) {
                        //����������ʽΪfocusClassʱ����ȡ����ʽ
                        if (this.focusItem.className == this.focusClass) this.focusItem.className = this.defaultClass;
                    }
                    //ѡ�е�ǰ��
                    this.target.className = this.focusClass;
                    this.focusItem = this.target;
                    this.focusItems[0] = this.target;
                }
                else {
                    changed = false;
                }
            }

            //ִ��onchange�¼�
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
    /// <summary>����focusItem</summary>

    for (var i = 0; i < this.focusItems.length; i++) {
        this.focusItems[i].className = this.defaultClass;
    }

    this.focusItem = null;
    this.focusItems.length = 0;
    this.target = null;
}

FocusView.prototype.setFocus = function(items, focusClass) {
    /// <summary>����һ������������</summary>
    /// <param name="items" type="String|Array">��ָ����һ������������Ϊ������</param>

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
        //Ĭ��ѡ����ᴥ��onchange�¼�, ��Ϊû��event����
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

                // ѡ����
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
    /// <summary>ִ�а�</summary>

    //������� container
    this.container = FocusView.__GetElement(this.container);

    //���container��Ϊnull, ִ�а�
    if (this.container != null && FocusView.__ReturnEventValue(this, 'onbind')) {
        //��ʶ�Ѿ���
        this.bound = true;

        //���bindBy
        this.bindBy = this.bindBy.toUpperCase();
        if (this.bindBy != 'TAG' && this.bindBy != 'ID') this.bindBy = 'ID';

        //����Ԫ�� bindings
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

        //�������� excludings
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
        //���ַ���ת��ΪElement
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
        //����excludings��null��
        FocusView.__CleanArray(this.excludings);

        //����tbody������
        if (this.bindBy == 'TAG') {
            for (var i = this.bindings.length - 1; i >= 0; i--) {
                if (this.bindings[i] == 'TR') {
                    //�����ǰ�������1�������һ���ֵ��ΪTBODY, ����һ��'TBODY'
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
        //		//Ĭ��ѡ����ᴥ��onchange�¼�, ��Ϊû��event����
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
        //				// ѡ����
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

        //����¼�
        var focusView = this;
        //����ƶ��¼�
        focusView.container.onmousemove = function(ev) {
            focusView.over(FocusView.__GetTargetByEvent(focusView, ev), ev);
        }
        //��껮���¼�
        focusView.container.onmouseout = function(ev) {
            if (focusView.overItem != null) {
                focusView.overItem.className = (focusView.overItem == focusView.focusItem ? focusView.focusClass : focusView.defaultClass);
                focusView.overItem = null;
                focusView.target = null;
            }
        }
        //���������¼�
        focusView.container.onmousedown = function(ev) {
            if (FocusView.__LeftButton(ev)) {
                focusView.click(FocusView.__GetTargetByEvent(focusView, ev), ev);
            }
        }
        //���������¼�
        focusView.container.onmouseup = function(ev) {
            if (FocusView.__LeftButton(ev)) {
                focusView.focus(FocusView.__GetTargetByEvent(focusView, ev), ev);
            }
        }
        //����Ҽ��¼�		
        focusView.container.oncontextmenu = function(ev) {
            if (focusView.oncontextmenu != null) {
                ev = ev || window.event;
                focusView.__event = ev;
                focusView.focus(FocusView.__GetTargetByEvent(focusView, ev), ev);
                focusView.__ExecuteEvent('oncontextmenu', focusView.focusItem);

                return false;
            }
        }

        //���浽ȫ�ֱ���
        document.focusViews[focusView.container.id] = focusView;
    }
}

FocusView.prototype.unbind = function() {
    /// <summary>ȡ�����еİ�</summary>

    if (this.bound && FocusView.__ReturnEventValue(this, 'onunbind')) {
        //ȡ���¼���
        if (this.container != null) {
            this.container.onmousemove = null;
            this.container.onmouseout = null;
            this.container.onmousedown = null;
            this.container.onmouseup = null;
        }
        //�趨�󶨱�־Ϊfalse
        this.bound = false;
        //ȡ��ȫ�ֱ���
        delete document.focusViews[this.id];
    }
}

FocusView.prototype.showMenu = function(menuName) {
    /// <summary>��ʾ�Ҽ��˵�</summary>
    document.menus[menuName].show(this.__event);
}

FocusView.prototype.__ExecuteEvent = function(eventName, argument) {
    /// <summary>ִ���¼�</summary>

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
    /// <summary>ִ���¼�������ֵ</summary>
    /// <param name="focusView" type="FocusView">FocusView����</>
    /// <param name="eventName" type="String">�¼���</param>
    /// <param name="ev">�¼�����</param>
    /// <returns>����ֵ</returns>

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
    /// <summary>�����¼��õ�����</summary>
    /// <param name="focusView" type="FocusView">FocusView����</param>
    /// <param name="ev" type="EventArgs">����¼�</param>
    /// <returns type="Element">��ǰĿ�����</returns>

    ev = ev || window.event;
    var target = ev.target || ev.srcElement;

    return focusView.bindBy == 'ID' ? FocusView.__GetTargetById(focusView.container, focusView.bindings, target) : FocusView.__GetTargetByTagName(focusView.container, focusView.bindings, target);
}

FocusView.__GetTarget = function(focusView, target) {
    /// <summary>�ж�Ŀ��, ����over, click, focus����</summary>

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

    //��������
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
    /// <summary>�ж�Ԫ��</summary>
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
    /// <summary>�ж϶����ǲ���Ԫ��</summary>
    if (element != null) {
        return (element.nodeType != undefined && element.nodeName != undefined);
    }
    else {
        return false;
    }
}

FocusView.__IsFocusItem = function(focusView, target) {
    /// <summary>�ж϶����ǲ��ǽ������</summary>

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
    /// <summary>����ǲ��ǰ���Ctrl��</summary>

    ev = ev || window.event;
    if (ev != null) {
        return ev.ctrlKey;
    }
    else {
        return false;
    }
}

FocusView.__LeftButton = function(ev) {
    /// <summary>����ǲ��ǰ���������</summary>
    ev = ev || window.event;
    if (ev != null) {
        return ev.button == 0 || ev.button == 1;
    }
    else {
        return false;
    }
}

FocusView.__CleanArray = function(array) {
    /// <summary>���������е�null��undefined��</summary>

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
    ///		��bindBy == 'TAG' ʱ, �������г�ʼֵ�õ�����, ���ڳ�ʼ��focusItems,  ֧�� n (���һ��)
    /// </summary>
    /// <param name="container" type="Element">��container��ʼ���Ķ���<param>
    /// <param name="values" type="String|Array" elementType="String">�󶨶����Index�ַ������ַ�������(.�ָ�), ��������TBODY<param>
    /// <returns type="Element"></returns>

    //�����������, �������
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
        //�����'TBODY', �����һ��
        if (container.lastChild.nodeName == 'TBODY') {
            return FocusView.__GetTargetByTagIndex(container.lastChild, values);
        }
        else {
            var tagNodes = new Array();

            //����<tag>��ǩ
            for (var i = 0; i < container.childNodes.length; i++) {
                if (container.childNodes[i].nodeType == 1) {
                    tagNodes[tagNodes.length] = container.childNodes[i];
                }
            }

            var n = tagNodes.length - 1;
            var index = eval(values[0]);

            //����趨ֵС��0, �趨Ϊ0
            if (index < 0) index = 0;
            //����趨ֵ�����ڵ�����, ѡ�����һ���ڵ�
            if (index > n) index = n;

            //����������һ��,����������
            if (values.length > 1) {
                //��values��ȥ����һ��
                for (var j = 0; j < values.length - 1; j++) {
                    values[j] = values[j + 1];
                }
                values.length--;

                return FocusView.__GetTargetByTagIndex(tagNodes[index], values);
            }
            //��������һ��, ����
            else {
                return tagNodes[index];
            }
        }
    }
}

FocusView.__GetTargetById = function(container, bindings, target) {
    /// <summary>����id�õ�����</summary>
    /// <param name="container" type="Element">FocusView ����<param>
    /// <param name="bindings" type="Array" elementType="String">�󶨶����ID����<param>
    /// <param name="target" type="Element">����Ŀ��<param>
    /// <returns type="Element"></returns>

    if (target != null && target != container) {
        var isBinding = false;

        if (target.id != '') {
            //���Ŀ������Ƿ���bindings��
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
    /// <summary>����tagName�õ�����</summary>
    /// <param name="container" type="Element">FocusView ����<param>
    /// <param name="bindings" type="Array" elementType="String">�󶨶������������<param>
    /// <param name="target" type="Element">����Ŀ��<param>
    /// <returns type="Element"></returns>

    if (target != null && target != container) {
        if (target.nodeName == bindings[bindings.length - 1]) {
            var isBinding = true;
            var currentNode = target;

            //����bindings, ���target��target�ĸ������ڵ�nodeName�Ƿ���bindings�ĸ���ƥ��
            for (var i = bindings.length - 1; i >= 0; i--) {
                if (currentNode.nodeName != bindings[i]) {
                    isBinding = false;
                    break;
                }
                currentNode = currentNode.parentNode;
            }
            //���currentNode�ǲ���container
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
    /// <summary>��ʼ��ҳ������FocusView</summary>

    //��ʼ��ҳ��<FocusView>���
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