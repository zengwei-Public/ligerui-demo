//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.Popup.js
// ʵ��ҳ�ڵ�������
// document.popups, document.popup, Popup

/**********

	<Popup Element="ElementID" Position="*" Offset="x,y" Fade="true|false" Modal="true|false" Hidings="ElementID1,ElementID2,..." Duration="Integer" OpenButton="ElementID" CloseButton="ElementID" ConfirmButton="ElementID" CancelButton="ElementID" DragBar="ElementID" Visible="Boolean" OnOpen="Function" OnClose="Function" OnConfirm="Function" OnCancel="Function" MaskColor="Color" MaskOpacity="Number" />
	
	--- * Position ---
		Top Left
		Top Center
		Top Right
		Middle Left
		Middle Center
		Middle Right
		Bottom Left
		Bottom Center
		Bottom Right
		ButtonLeft
		ButtonRight
		ButtonTop
		ButtonBottom
		Event
		x,y
		
**********/

/// <global type="HashArray" elementType="Popup">ҳ���϶�������� Popup ����ļ���</global>
document.popups = new Array();
/// <global type="Popup">ҳ�������ڴ򿪵� Popup ����</global>
document.popup = null;
/// <global type="Element">ҳ���ϵ�Mask</global>
document.write('<div id="__PopupMask" style="background-color:#666666; z-index:1000; position:absolute; visibility:hidden; display:none; left:0; top:0;">&nbsp;</div>');

Popup = function(element)
{
	/// <summary>
	///		Popup ���캯��
	/// </summary>
	
	/// <value type="Element" mayBeNull="false">��Ԫ�ع���</value>
	if(typeof(element) == 'string') element = document.getElementById(element);
	this.element = element;	
	/// <value type="String" values="|Event|x,y" defaultValue="" mayBeNull="true">��������, ����/�¼�/����, Ĭ�Ͼ���ҳ��</value>
	this.position = 'middle center';
	/// <value type="String" mayBeNull="trye">x��y���ϵ�ƫ����</value>
	this.offset = {x:0, y:0};
	
	/// <value type="Boolean" mayBeNull="false">Ĭ��״̬, �Ƿ��뵭��</value>
	this.fade = true;		
	/// <value type="Boolean" mayBeNull="true">�Ƿ�ģ̬</value>
	this.modal = true;
	
	/// <value type="Boolean" mayBeNull="false">Ĭ��״̬, �Ƿ�ɼ�</value>
	this.visible = false;	
	/// <value type="Duration" mayBeNull="true">����ʱ��, 0Ϊһֱ��ʾ</value>
	this.duration = 0;
	
	/// <value type="String|Array" mayBeNull="true">��ʾʱ��Ҫ���صĶ���</value>
	this.hidings = null;
	
	/// <value type="Element" mayBeNull="true">�򿪰�ť</value>
	this.openButton = document.getElementById(this.element.id + '_OpenButton');	
	/// <value type="Element" mayBeNull="true">�رհ�ť</value>
	this.closeButton = document.getElementById(this.element.id + '_CloseButton');	
	/// <value type="Element" mayBeNull="true">ȷ�ϰ�ť</value>
	this.confirmButton = document.getElementById(this.element.id + '_ConfirmButton');	
	/// <value type="Element" mayBeNull="true">ȡ����ť</value>
	this.cancelButton = document.getElementById(this.element.id + '_CancelButton');
	/// <value type="Element" mayBeNull="true">�϶���</value>
	this.dragBar = document.getElementById(this.element.id + '_DragBar');
	
	/// <value type="Mask" mayBeNull="false">���ֲ�</value>
	this.mask = new Mask();
}

/// <value type="Document">��ǰ�ĵ�</value>
Popup.square = (document.compatMode == 'CSS1Compat'? document.documentElement : document.body);

/// <value type="Function|String" mayBeNull="true">��ʱִ��</value>
Popup.prototype.onopen = null;
/// <value type="Function|String" mayBeNull="true">�ر�ʱִ��</value>
Popup.prototype.onclose = null;
/// <value type="Function|String" mayBeNull="true">ȷ��ʱִ��</value>
Popup.prototype.onconfirm = null;
/// <value type="Function|String" mayBeNull="true">ȡ��ʱִ��</value>
Popup.prototype.oncancel = null;

Popup.prototype.bind = function()
{
	/// <summary>��ʼ��</summary>
	
	if(this.element != null)
	{	
		if(this.position == null) this.position = 'middle center';
		
		//ƫ�ƾ���
		if(this.offset == null) this.offset = {x:0, y:0};
		if(typeof(this.offset) == 'string')
		{
			var offset = this.offset;
			if(offset == '' || !/^\-?[0-9]+,\-?[0-9]+$/.test(offset)) offset = '0,0';
			offset = offset.split(',');
			this.offset = {x:parseInt(offset[0]), y:parseInt(offset[1])};
		}
		
		//���뵭��
		var fade = this.fade;
		if(fade == null) fade = true;
		if(typeof(fade) == 'string')
		{
			//֧��true��false�Ĳ����ִ�Сд����
			if(/^true$/i.test(fade) || /^false$/i.test(fade))
			{
				fade = fade.toLowerCase();
			}
			//֧�ֱ��ʽ
			fade = eval(fade);		
		}
		if(fade != true && fade != false) fade = false;
		this.fade = fade;
		
		//ģ̬
		var modal = this.modal;			
		if(modal == null) modal = (this.position != 'event');
		if(typeof(modal) == 'string')
		{
			//֧��true��false�Ĳ����ִ�Сд����
			if(/^true$/i.test(modal) || /^false$/i.test(modal))
			{
				modal = modal.toLowerCase();
			}
			//֧�ֱ��ʽ
			modal = eval(modal);		
		}
		if(modal != true && modal != false) modal = false;
		this.modal = modal;
		
		//��ʾʱ��Ҫ���صĶ���			
		if(this.hidings != null)
		{
			var hidings = this.hidings;
			this.hidings = new Array();
			if(typeof(hidings) == 'string')
			{
				hidings = hidings.split(',');
				for(var i=0; i<hidings.length; i++)
				{
					this.hidings[i] = document.getElementById(hidings[i]);
				}
			}
			else if(hidings instanceof Array)
			{
				for(var i=0; i<hidings.length; i++)
				{
					if(typeof(hidings[i]) == 'string')
					{
						this.hidings[i] = document.getElementById(hidings[i]);
					}
					else
					{
						this.hidings[i] = hidings[i];
					}
				}
			}
		}
		
		//����ʱ��
		this.duration = parseInt(this.duration);
		if (isNaN(this.duration)) this.duration = 0;
		
		//�򿪰�ť
		if(this.openButton == null) this.openButton = this.element.id + '_OpenButton';
		if(typeof(this.openButton) == 'string') this.openButton = document.getElementById(this.openButton);			
		//�رհ�ť
		if(this.closeButton == null) this.closeButton = this.element.id + '_CloseButton';
		if(typeof(this.closeButton) == 'string') this.closeButton = document.getElementById(this.closeButton);			
		//ȷ�ϰ�ť
		if(this.confirmButton == null) this.confirmButton = this.element.id + '_ConfirmButton';
		if(typeof(this.confirmButton) == 'string') this.confirmButton = document.getElementById(this.confirmButton);			
		//ȡ����ť
		if(this.cancelButton == null) this.cancelButton = this.element.id + '_CancelButton';
		if(typeof(this.cancelButton) == 'string') this.cancelButton = document.getElementById(this.cancelButton);
		//�϶���
		if(this.dragBar == null) this.dragBar = this.element.id + '_DragBar';
		if(typeof(this.dragBar) == 'string') this.dragBar = document.getElementById(this.dragBar);
		
		//�Ƿ�ɼ�
		var visible = this.visible;
		if(typeof(visible) == 'string')
		{
			//֧��true��false�Ĳ����ִ�Сд����
			if(/^true$/i.test(visible) || /^false$/i.test(visible))
			{
				visible = visible.toLowerCase();
			}
			//֧�ֱ��ʽ
			visible = eval(visible);		
		}
		if(visible != true && visible != false) visible = false;
		this.visible = visible;
		
		//���ֲ����ɫ
		if(this.mask.color == null) this.mask.color = '#666666';
		//���ֲ��͸����
		if(this.mask.opacity == null) this.mask.opacity = 3;
		if(typeof(this.mask.opacity) == 'string')
		{
			this.mask.opacity = parseInt(this.mask.opacity);
		}

		//�������ʼ��
		this.element.style.display = 'none';
		this.element.style.position = 'absolute';
		this.element.style.zIndex = '1001';
		this.element.style.visibility = 'hidden';
		this.element.style.overflow = 'hidden';
		
		var popup = this;
	
		//�򿪰�ť
		if(this.openButton != null)
		{
			Popup.addListener(this.openButton, 'click', function(ev){popup.open(ev);});
		}
		
		//�رհ�ť
		if(this.closeButton != null)
		{
			Popup.addListener(this.closeButton, 'click', function(ev){popup.close(ev);});
		}
		
		//ȷ�ϰ�ť
		if(this.confirmButton != null)
		{
			Popup.addListener(this.confirmButton, 'click', function(ev){popup.confirm(ev);});
		}
		
		//ȡ����ť
		if(this.cancelButton != null)
		{
			Popup.addListener(this.cancelButton, 'click', function(ev){popup.cancel(ev);});
		}
		
		//�϶���
		if (this.dragBar != null)
		{
			this.dragBar.style.cursor = 'move';
			Popup.__mouseDown = false; //�϶��¼����ж��Ƿ��������
			Popup.__mouseOffsetX = 0;
			Popup.__mouseOffsetY = 0; //���λ�ú�popup��ƫ�ƾ���
							
			Popup.__DragMouseDown = function(ev)
			{
				Popup.__mouseDown = true;
					
				ev = ev || window.event;
				
				//��갴��ʱȷ�����ָ���popup��ƫ�ƾ���
				Popup.__mouseOffsetX = ev.clientX + Popup.square.scrollLeft - popup.element.offsetLeft;
				Popup.__mouseOffsetY = ev.clientY + Popup.square.scrollTop - popup.element.offsetTop;
			}
				
			Popup.__DragMouseMove = function(ev)
			{				
				if (Popup.__mouseDown)
				{	
					ev = ev || window.event;
						
					var x, y;						
					x = ev.clientX - Popup.__mouseOffsetX;
					y = ev.clientY - Popup.__mouseOffsetY;
						
					if (x < 0) x = 0;
					if (x + popup.element.offsetWidth > Popup.square.offsetWidth) x = Popup.square.offsetWidth - popup.element.offsetWidth;
					if (y < 0) y = 0;
					if (y + popup.element.offsetHeight > Popup.square.offsetHeight) y = Popup.square.offsetHeight - popup.element.offsetHeight;
						
					popup.element.style.left = Popup.square.scrollLeft + x + 'px';
					popup.element.style.top = Popup.square.scrollTop + y +  'px';		
				}
			}
			Popup.__DragMouseUp = function()
			{
				Popup.__mouseDown = false;
			}
				
			//�����¼�
			Popup.addListener(this.dragBar, 'mousedown', Popup.__DragMouseDown);
			Popup.addListener(Popup.square, 'mousemove', Popup.__DragMouseMove);
			Popup.addListener(Popup.square, 'mouseup', Popup.__DragMouseUp);			
		}
		
		if(this.visible)
		{
			this.show();
		}
	
		document.popups[this.element.id] = popup;
	}
};

Popup.prototype.locate = function(ev)
{
	/// <summary>Ϊpopup��λ</summary>
	/// <param name="ev" type="EventArgs"></param>
	
	//debugger;
	
	if(this.position.indexOf(',') == -1) this.position = this.position.toLowerCase();
	
	var documentWidth = Popup.square.clientWidth, documentHeight = Popup.square.clientHeight;
	var scrollLeft = Popup.square.scrollLeft, scrollTop = Popup.square.scrollTop;
	var x = scrollLeft, y = scrollTop;
	
	switch(this.position)
	{
		case 'middle center':
			x += (documentWidth - this.element.offsetWidth) / 2;
			y += (documentHeight - this.element.offsetHeight) / 2;
			break;
		case 'top left':
			x += 0;
			y += 0;
			break;
		case 'top center':
			x += (documentWidth - this.element.offsetWidth) / 2;
			y += 0;
			break;
		case 'top right':
			x += documentWidth - this.element.offsetWidth;
			y += 0;
			break;
		case 'middle left':
			x += 0;
			y += (documentHeight - this.element.offsetHeight) / 2;
			break;
		case 'middle right':
			x += documentWidth - this.element.offsetWidth;
			y += (documentHeight - this.element.offsetHeight) / 2;
			break;
		case 'bottom left':
			x += 0;
			y += documentHeight - this.element.offsetHeight;
			break;
		case 'bottom center':
			x += (documentWidth - this.element.offsetWidth) / 2;
			y += documentHeight - this.element.offsetHeight;
			break;
		case 'bottom right':
			x += documentWidth - this.element.offsetWidth;
			y += documentHeight - this.element.offsetHeight;				
			break;
		case 'buttonleft':
			x = this.openButton.offsetLeft - this.element.offsetWidth;
			y = this.openButton.offsetTop;				
			if(y + this.element.offsetHeight > scrollTop + documentHeight)
			{
				y = this.openButton.offsetTop + this.openButton.offsetHeight - this.element.offsetHeight;
			}
			break;
		case 'buttonright':
			x = this.openButton.offsetLeft + this.openButton.offsetWidth;
			y = this.openButton.offsetTop;	
			if(y + this.element.offsetHeight > scrollTop + documentHeight)
			{
				y = this.openButton.offsetTop + this.openButton.offsetHeight - this.element.offsetHeight;
			}
			break;
		case 'buttontop':
			x = this.openButton.offsetLeft;
			if(x + this.element.offsetWidth > scrollLeft + documentWidth)
			{
				x = this.openButton.offsetLeft + this.openButton.offsetWidth - this.element.offsetWidth;
			}
			y = this.openButton.offsetTop - this.element.offsetHeight;
			break;
		case 'buttonbottom':
			x = this.openButton.offsetLeft;
			if(x + this.element.offsetWidth > scrollLeft + documentWidth)
			{
				x = this.openButton.offsetLeft + this.openButton.offsetWidth - this.element.offsetWidth;
			}
			y = this.openButton.offsetTop + this.openButton.offsetHeight;
			break;
		case 'event':
			ev = ev || window.event;
			x = 0, y = 0;
			if(ev)
			{					
				x = ev.clientX;
				y = ev.clientY;
				
				if(x + this.element.offsetWidth > documentWidth)
				{
					x = x - this.element.offsetWidth;
				}
				if(y + this.element.offsetHeight > documentHeight)
				{
					y = y - this.element.offsetHeight;
				}
				if(x < 0) x = 0;
				if(y < 0) y = 0;
				x += scrollLeft;
				y += scrollTop;
			}
			break;
		default:
			var location = this.position.split(',');
			x = scrollLeft + eval(location[0]);
			y = scrollTop + eval(location[1]);
			break;
	}
	
	x += this.offset.x;
	y += this.offset.y;
	
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	
	this.element.style.left = x + 'px';
	this.element.style.top = y + 'px';
}

Popup.prototype.show = function(quick, ev)
{
	/// <summary>��ʾ</summary>
	/// <param name="quick" type="Boolean">�Ƿ������ʾ</param>
	/// <param name="ev" type="EventArgs">�¼�����</param>
	
	//���ĳ��popup���ڵ��������У���ֹ
	if (Popup.__Timer.fadeOut != null) window.clearTimeout(Popup.__Timer.fadeOut);
	
	//�����������popup��ʾ��������	
	if(document.popup != null)
	{
		document.popup.hide(true);
	}
	
	//�Ƿ������ʾ
	if(quick == null) quick = !this.fade;
	
	//����Ӱ��popup��ʾ��Ԫ��
	Popup.__HideHidings(this.hidings);
	
	//��ʾMask
	if(this.modal)
	{
		this.mask.show();
	} 
	
	//��ʾ
	this.element.style.display = '';
	this.locate(ev);
	this.element.style.visibility = 'visible';		
	if(!quick)
	{
		Popup.__FadeIn(this.element.id, 0);
	}
	else
	{
		Popup.__SetOpacity(this.element, 10);
		//Popup.__Show(this.element.id); ע�͵�ԭ����popup�ڲ�͸��֮ǰҲӦ���ܱ��ر�
	}
	
	//����״̬
	this.visible = true;
	document.popup = this;	
	
	//����趨�˳���ʱ�䣬��ʱ������
	if (this.duration > 0)
	{
		Popup.__Timer.duration = window.setTimeout(function(){if (document.popup != null && Popup.__Timer.duration != null) document.popup.close();}, this.duration);
	}
}

Popup.prototype.hide = function(quick)
{
	/// <summary>����</summary>
	/// <param name="quick" type="Boolean">�Ƿ��������</param>
	
	if(this.visible)
	{
		//�Ƿ��������
		if(quick == null) quick = !this.fade;
		
		//�����ǰpopup���ڵ��������, ��ֹ
		if (Popup.__Timer.fadeIn != null) window.clearTimeout(Popup.__Timer.fadeIn);
		
		if(!quick)
		{
			//����
			Popup.__FadeOut(this.element.id, Popup.__GetOpacity(this.element));
		}
		else
		{		
			//��������
			this.element.style.display = 'none';
			this.element.style.visibility = 'hidden';
			
			Popup.__Hide(this.element.id);			
		}
		
		//�����Mask������
		if(this.modal)
		{
			this.mask.hide();
		}
		
		//��ʾpopup��ʱ���ص�Ԫ��
		Popup.__ShowHidings(this.hidings);
	}
}

Popup.prototype.open = function(ev)
{
	/// <summary>��</summary>
	/// <param name="ev" type="Event">�¼�����</param>
	
	if(document.popup != this)
	{
		if(Popup.__ReturnEventValue(this, 'onopen', ev))
		{
			this.show(null, ev);			
		}
	}
};
	
Popup.prototype.close = function(ev)
{
	/// <summary>�ر�</summary>
	/// <param name="ev" type="Event">�¼�����</param>
	
	if(document.popup == this)
	{
		if(Popup.__ReturnEventValue(this, 'onclose', ev))
		{
			this.hide();
		}
	}
};
	
Popup.prototype.confirm = function(ev)
{
	/// <summary>ȷ��</summary>
	/// <param name="ev" type="Event">�¼�����</param>
	
	if(document.popup == this)
	{
		if(Popup.__ReturnEventValue(this, 'onconfirm', ev))
		{
			this.hide();
		}
	}
};
	
Popup.prototype.cancel = function(ev)
{
	/// <summary>ȡ��</summary>
	/// <param name="ev" type="Event">Firefox�¼�����</param>
	
	if(document.popup == this)
	{
		if(Popup.__ReturnEventValue(this, 'oncancel', ev))
		{
			this.hide();
		}
	}
};

Popup.__Timer = {duration:null, fadeIn:null, fadeOut:null};
Popup.__ReturnEventValue = function(popup, eventName, ev)
{
	/// <summary>����Popup�¼��ķ���ֵ</summary>
	
	var returnValue = true;
	
	if(popup[eventName] != null)
	{
		if(typeof(popup[eventName]) == 'function')
		{
			returnValue = popup[eventName](ev);
		}
		else if(typeof(popup[eventName]) == 'string')
		{
			eval('returnValue = function(ev){' + popup[eventName] + '}');							
			returnValue = returnValue.call(popup, ev);
		}
		
		//Ĭ��ֵΪtrue
		if(returnValue != false && returnValue != true) returnValue = true;
	}	
	
	return returnValue;
}

Popup.__SetOpacity = function(element, alpha)
{
	/// <summary>���� Popup ��͸����<summary>
	/// <param name="alpha" type="Integer">͸���� 0-10 </param>
	
	if(alpha == null) alpha = 10;
	
	if(navigator.appName == 'Microsoft Internet Explorer')
	{
		element.style.filter = 'alpha(opacity=' + (alpha*10) + ')';
	}
	else
	{
		element.style.opacity = alpha/10; 
	}
}

Popup.__GetOpacity = function(element)
{
	/// <summary>�õ�Popup��͸����</summary>
	/// <return>͸����ֵ 0-10</return>
	
	var alpha = 10;
	if(navigator.appName == 'Microsoft Internet Explorer')
	{
		var reg = new RegExp('opacity=[0-9]{1,2}\\)', 'i');
		if (reg.test(element.style.filter))
		{
			var alpha = reg.exec(element.style.filter)[0];
			alpha = alpha.replace(/opacity=/i, '');
			alpha = alpha.replace(')', '');
			alpha = parseInt(alpha) / 10;
		}	
	}
	else
	{
		 if (element.style.opacity != '')
		 {
		 	alpha = parseInt(element.style.opacity) * 10;
		 } 
	}
	
	return alpha;
}

Popup.__Show = function(elementId)
{
	/// <summary>��ʾ�� ��ʾ״̬</summary>
	
	document.popups[elementId].visible = true;
	document.popup = document.popups[elementId];
}

Popup.__Hide = function(elementId)
{
	/// <summary>���غ� ��ʾ״̬</summary>
	
	document.popups[elementId].visible = false;
	document.popup = null;
	
	//���ó���ʱ�����
	if (Popup.__Timer.duration != null) window.clearTimeout(Popup.__Timer.duration);
}

Popup.__FadeIn = function(elementId, alpha)
{
	/// <summary>����Ч��</summary>
	/// <param name="elementId" type="String">Block ID</param>
	/// <param name="alpha" type="Integer">͸����</param>
	
	if(alpha < 10)
	{
		alpha ++;
		
		var element = document.getElementById(elementId);		
		Popup.__SetOpacity(element, alpha);
		
		Popup.__Timer.fadeIn = window.setTimeout(function(){Popup.__FadeIn(elementId, alpha);}, 50);
	}
	else
	{
		//Popup.__Show(elementId);
	}
}
	
Popup.__FadeOut = function(elementId, alpha)
{
	/// <summary>����Ч��</summary>
	/// <param name="elementId" type="String">Block ID</param>
	/// <param name="alpha" type="Integer">͸����</param>
	
	var element = document.getElementById(elementId);	
	
	if(alpha > 0)
	{
		alpha --;
		
		Popup.__SetOpacity(element, alpha);
		
		Popup.__Timer.fadeOut = window.setTimeout(function(){Popup.__FadeOut(elementId, alpha);}, 50);
	}
	else
	{
		element.style.visibility = 'hidden';
		element.style.display = 'none';
		
		Popup.__Hide(elementId);
	}
}

Popup.__HideHidings = function(hidings)
{
	/// <summary>���ز����ڲ��µ�����, ��flash��select</summary>
	/// <param name="hidings" type="Array">Ҫ���ص�����<param>
	
	if(hidings instanceof Array)
	{
		for(var i=0; i<hidings.length; i++)
		{
			hidings[i].style.display = 'none';
		}
	}
}

Popup.__ShowHidings = function(hidings)
{
	/// <summary>��ʾ�����ڲ��µ�����, ��flash��select</summary>
	/// <param name="hidings" type="Array">Ҫ��ʾ������<param>
	
	if(hidings instanceof Array)
	{
		for(var i=0; i<hidings.length; i++)
		{
			hidings[i].style.display = '';
		}
	}
}

Popup.resize = function()
{
	/// <summary>���ɼ����ڴ�С�ı�ʱ</summary>
	
	//����Mask��Ĵ�С
	Mask.resize();
		
	if(document.popup != null)
	{		
		if(document.popup.position != 'event') document.popup.locate();
	}
}
	
Mask = function(color, opacity)
{
	/// <summary>���캯��</summary>
	
	/// <value type="String">Modalģʽ�µ�Mask��͸����</value>
	this.color = color || '#666666';
	
	/// <value type="Integer">Modalģʽ�µ�Mask��͸����</value>
	this.opacity = opacity || 3;
}

/// <global type="Element">Modalģʽ�µ�Mask</global>
Mask.Element = document.getElementById('__PopupMask');

Mask.prototype.show = function()
{
	/// <summary>��ʾ Mask<summary>	
	
	Mask.Element.style.display = '';		
	Mask.Element.style.visibility = 'visible';
	Mask.Element.style.backgroundColor = this.color;
	Mask.__SetOpacity(this.opacity);
}

Mask.prototype.hide = function()
{
	/// <summary>���� Mask<summary>
	
	Mask.Element.style.visibility = 'hidden';
	Mask.Element.style.display = 'none';
}

Mask.resize = function()
{
	/// <summary>��������Mask�Ŀ�Ⱥ͸߶�</summary>
	
	var width = 0, height = 0;
	//�����
	var childNodes = document.body.childNodes;
	for(var i=0; i<childNodes.length; i++)
	{
		if(childNodes[i].nodeType == 1)
		{
			if(childNodes[i].offsetLeft + childNodes[i].offsetWidth > width)
			{
				width = childNodes[i].offsetLeft + childNodes[i].offsetWidth;
			}
		}
	}
	//���߶�
	for(var i=childNodes.length-1; i>=0; i--)
	{
		if(childNodes[i].offsetTop > 0)
		{
			height = childNodes[i].offsetTop + childNodes[i].offsetHeight;			
			break;
		}
	}
	
	var documentWidth = Popup.square.scrollLeft + Popup.square.clientWidth;
	if(width < documentWidth) width = documentWidth;
	var documentHeight = Popup.square.scrollTop + Popup.square.clientHeight;	
	if(height < documentHeight) height = documentHeight;
	
	Mask.Element.style.width = width + 'px';
	Mask.Element.style.height = height + 'px';
}

Mask.__SetOpacity = function(alpha)
{
	/// <summary>���� Mask ��͸����<summary>
	/// <param name="alpha" type="Integer">͸���� 0-10 </param>
	
	if(alpha == null) alpha = 0;
	
	if(navigator.appName == 'Microsoft Internet Explorer')
	{
		Mask.Element.style.filter = 'alpha(opacity=' + (alpha*10) + ')';
	}
	else
	{
		Mask.Element.style.opacity = alpha/10;
	}
}

Popup.addListener = function(object, eventName, func)
{
	eventName = eventName.toLowerCase();
	if (navigator.appName == 'Microsoft Internet Explorer')
	{
		object.attachEvent('on' + eventName, func);
	}
	else
	{
		object.addEventListener(eventName, func, false);
	}
}

function __InitializePopups()
{
	/// <summary>��ʼ��ҳ������Popup</summary>
	
	Mask.resize();
	
	Popup.addListener(window, 'resize', Popup.resize);
	
	var popups = document.getElementsByTagName('Popup');
	var popup;
	for(var i=0; i<popups.length; i++)
	{
		popup = new Popup(popups[i].getAttribute('Element'));
		popup.position = popups[i].getAttribute('Position');
		popup.offset = popups[i].getAttribute('Offset');
		popup.fade = popups[i].getAttribute('Fade');
		popup.modal = popups[i].getAttribute('Modal');
		popup.hidings = popups[i].getAttribute('Hidings');
		popup.duration = popups[i].getAttribute('Duration');
		popup.openButton = popups[i].getAttribute('OpenButton');
		popup.closeButton = popups[i].getAttribute('CloseButton');
		popup.confirmButton = popups[i].getAttribute('ConfirmButton');
		popup.cancelButton = popups[i].getAttribute('CancelButton');
		popup.dragBar = popups[i].getAttribute('DragBar');
		popup.visible = popups[i].getAttribute('Visible');
		popup.onopen = popups[i].getAttribute('OnOpen');
		popup.onclose = popups[i].getAttribute('OnClose');
		popup.onconfirm = popups[i].getAttribute('OnConfirm');
		popup.oncancel = popups[i].getAttribute('OnCancel');
		popup.mask.color = popups[i].getAttribute('MaskColor');
		popup.mask.opacity = popups[i].getAttribute('MaskOpacity');
		popup.bind();
	}
}

__InitializePopups();