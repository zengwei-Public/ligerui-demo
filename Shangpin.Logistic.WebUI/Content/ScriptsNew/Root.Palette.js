//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.Palette.js
// 颜色面板
// document.palettes, Palette

/*
	<Palette ID="String" TextBox="Element|String" Color="String" onchange="String|Function"></Palette>
*/ 

/*

*/

/// <global type="HashArray" elementType="Popup">页面上定义的所有 Popup 对象的集合</global>
document.palettes = new Array();

Palette = function(id)
{
	this.id = id || null;		
	this.textBox = null;
	this.color = null;
	this.element = null;
}

// 全局变量, 脚本保存路径
Palette.$root = function()
{
	var scripts = document.getElementsByTagName('SCRIPT');
	var path = scripts[scripts.length - 1].src;
	path = path.substring(0, path.lastIndexOf('/') + 1);	
	return path;
}();

// 全局变量, 相关图片保存路径
Palette.$images = {
	picker: Palette.$root + 'images/colorpicker_up.gif',
	pickerDown: Palette.$root + 'images/colorpicker_down.gif',
	clearButton: Palette.$root + 'images/colorpalette_nocolor.gif',
	switchButton: Palette.$root + 'images/colorpalette_switch.gif',
	closeButton: Palette.$root + 'images/colorpalette_close.gif',
	over216: Palette.$root + 'images/colorpalette_over216.gif',
	over140: Palette.$root + 'images/colorpalette_over140.gif'	
}

Palette.prototype.onchange = null;

Palette.prototype.initialize = function()
{
	//id
	if (this.id == null || this.id == '') this.id = 'Palette_' + document.palettes.length;

	//textbox
	if(typeof(this.textBox) == 'string') this.textBox = document.getElementById(this.textBox);	
	
	//color
	if (this.color != null && this.textBox != null) this.textBox.value = this.color;
	
	//pickerButton
	var span = Palette.createElement('span', {id:this.id});
	if (this.color != null)
	{
		span.style.backgroundColor = this.color;
		span.setAttribute('name', this.color);
		span.setAttribute('color', this.color);
	}
	var img = Palette.createElement('IMG', {src:Palette.$images.picker, width:20, height:18});
	Palette.addListener(img, 'click', Palette.__ShowPalette);
	span.appendChild(img);
	if (this.element != null)
	{
		//使用标签初始化
		this.element.parentNode.insertBefore(span, this.element);
	}
	else if (this.textBox != null)
	{
		//使用脚本初始化并且有文本框
		if (this.textBox.nextSibling != null)
		{
			this.textBox.parentNode.insertBefore(span, this.textBox.nextSibling);
		}
		else
		{
			this.textBox.parentNode.appendChild(span);
		}
	}
	
	document.palettes[this.id] = this;
}

Palette.square = (document.compatMode == 'CSS1Compat'? document.documentElement : document.body);

Palette.__ShowPalette = function(ev)
{
	var palette = document.getElementById('ColorPalette');
	if (palette.style.display == 'none')
	{
		ev = ev || window.event;
		var target = ev.target || ev.srcElement;
		
		target.src = Palette.$images.pickerDown;
		
		//确定显示位置	
		palette.style.display = '';
		var x, y;
		if (ev.clientX + palette.offsetWidth > Palette.square.offsetWidth)
		{
			x = Palette.square.scrollLeft + ev.clientX - palette.offsetWidth;
		}
		else
		{
			x = Palette.square.scrollLeft + ev.clientX;
		}
		if (ev.clientY < palette.offsetHeight)
		{
			y = Palette.square.scrollTop + ev.clientY;
		}
		else
		{
			y = Palette.square.scrollTop + ev.clientY - palette.offsetHeight;
		}
		palette.style.visibility = 'visible';
		
		//显示
		palette.style.left = x + 'px';
		palette.style.top = y + 'px';
		palette.style.display = '';
		
		//格式化控制台宽度
		document.getElementById('ColorPalette_Console').style.width = document.getElementById('ColorPalette_' + (document.getElementById('ColorPalette_SwitchButton').getAttribute('palette') == '216' ? 'Web216':'Pop140')).offsetWidth + 'px';
		
		palette.setAttribute('palette', target.parentNode.id)
		
		//初始化默认颜色
		if (target.parentNode.style.backgroundColor != '')
		{
			document.getElementById('ColorPalette_CurrentColor').style.backgroundColor = target.parentNode.getAttribute('color');
			document.getElementById('ColorPalette_ColorName').innerHTML = target.parentNode.getAttribute('name');
		}
	}
}

Palette.__HidePatelle = function()
{
	var palette = document.getElementById('ColorPalette');
	palette.style.visibility = 'hidden';
	palette.style.display = 'none';
	
	document.getElementById(palette.getAttribute('palette')).firstChild.src = Palette.$images.picker;
}

Palette.prototype.__ExecuteEvent = function(eventName, argument)
{
	/// <summary>执行事件</summary>
	
	if(this[eventName] != null)
	{
		if(typeof(this[eventName]) == 'function')
		{
			this[eventName](argument);
		}
		else if(typeof(this[eventName]) == 'string')
		{
			var ev;
			eval('ev = function(){' + this[eventName] + '}');							
			ev.call(this, argument);
		}
	}	
}

Palette.createElement = function(nodeName, properties, styles)
{
	/// <summary>创建元素</summary>
	var element = document.createElement(nodeName);
	if (properties != null)
	{
		for (var property in properties)
		{
			element[property] = properties[property];
		}
	}
	if (styles != null)
	{
		for (var style in styles)
		{
			element.style[style] = styles[style];
		}
	}
	return element;
}

Palette.addListener = function(object, eventName, func)
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

Palette.__GetStandardColors = function()
{
	var standardColors = ['#333333','#666666','#999999','#CCCCCC','#FFFFFF','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF'];
	
	var table, tbody, tr, td;
	table = Palette.createElement('TABLE', {border:0, cellPadding:0, cellSpacing:1}, {cursor:'pointer', backgroundColor:'#000000'});
	tbody = Palette.createElement('TBODY');
	tr = Palette.createElement('TR');
	td = Palette.createElement('TD', {width:10, rowSpan:12}, {backgroundColor:'#000000', cursor:'default'});
	tr.appendChild(td);
	td = Palette.createElement('TD', {width:10, height:10}, {backgroundColor:'#000000'});
	td.setAttribute('name', '#000000');
	td.setAttribute('color', '#000000');
	Palette.addListener(td, 'mouseover', Palette.__MouseOver);
	Palette.addListener(td, 'mouseout', Palette.__MouseOut);
	Palette.addListener(td, 'click', Palette.__PickColor);
	tr.appendChild(td);
	td = Palette.createElement('TD', {width:10, rowSpan:12}, {backgroundColor:'#000000', cursor:'default'});
	tr.appendChild(td);
	tbody.appendChild(tr);
	
	for (var i=0; i<standardColors.length; i++)
	{
		tr = Palette.createElement('TR');
		td = Palette.createElement('TD', {width:10, height:10}, {backgroundColor:standardColors[i]});
		td.setAttribute('name', standardColors[i]);
		td.setAttribute('color', standardColors[i]);
		Palette.addListener(td, 'mouseover', Palette.__MouseOver);
		Palette.addListener(td, 'mouseout', Palette.__MouseOut);
		Palette.addListener(td, 'click', Palette.__PickColor);
		tr.appendChild(td);
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	return table;
}
Palette.__GetSafettyColors = function()
{
	function Hex(integer)
	{
		switch(integer)
		{
			case 12: return 'CC';
			case 15: return 'FF';
			default: return integer.toString() + integer.toString();
		}
	}
	
	var i,j,k;
	var table, tbody, tr, td;
	var color;
	
	table = Palette.createElement('TABLE', {border:0, cellPadding:0, cellSpacing:1}, {cursor:'pointer', backgroundColor:'#000000'});
	tbody = Palette.createElement('TBODY');
	
	for(i=0;i<=15;i+=3)
	{						
		tr = Palette.createElement('TR');
		for(j=0;j<7;j=j+3)
		{
			for(k=0;k<=15;k+=3)
			{
				color = '#' + Hex(j) + Hex(k) + Hex(i);
				td = Palette.createElement('TD', {width:10, height:10}, {backgroundColor:color});
				td.setAttribute('name', color);
				td.setAttribute('color', color);
				Palette.addListener(td, 'mouseover', Palette.__MouseOver);
				Palette.addListener(td, 'mouseout', Palette.__MouseOut);
				Palette.addListener(td, 'click', Palette.__PickColor);
				tr.appendChild(td);
			}
		}
		tbody.appendChild(tr);
	}
	for(i=0;i<=15;i+=3)
	{						
		tr = Palette.createElement('TR');
		for(j=9;j<=15;j+=3)
		{
			for(k=0;k<=15;k+=3)
			{
				color = '#' + Hex(j) + Hex(k) + Hex(i);
				td = Palette.createElement('TD', {width:10, height:10}, {backgroundColor:color});
				td.setAttribute('name', color);
				td.setAttribute('color', color);
				Palette.addListener(td, 'mouseover', Palette.__MouseOver);
				Palette.addListener(td, 'mouseout', Palette.__MouseOut);
				Palette.addListener(td, 'click', Palette.__PickColor);
				tr.appendChild(td);
			}
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody)
	return table;
}
Palette.__GetPopularColors = function()
{
	var popularColors = [
						 [{color:'#000000',name:'黑'},{color:'#800000',name:'栗'},{color:'#8B0000',name:'深红'},{color:'#FF0000',name:'红'},{color:'#000080',name:'海军蓝'},{color:'#800080',name:'紫'},{color:'#4B0082',name:'靛蓝'},{color:'#00008B',name:'深蓝'},{color:'#8B008B',name:'深洋红'},{color:'#0000CD',name:'暗蓝'},{color:'#9400D3',name:'深紫红'},{color:'#0000FF',name:'蓝'},{color:'#FF00FF',name:'桃红'},{color:'#FF00FF',name:'洋红'}],
						 [{color:'#DC143C',name:'深红'},{color:'#FF1493',name:'深粉红'},{color:'#C71585',name:'暗紫红'},{color:'#191970',name:'黑蓝'},{color:'#B22222',name:'砖红'},{color:'#A52A2A',name:'褐'},{color:'#8A2BE2',name:'蓝紫'},{color:'#9932CC',name:'深兰花紫'},{color:'#483D8B',name:'深青蓝'},{color:'#FF4500',name:'橙红'},{color:'#8B4513',name:'鞍褐'},{color:'#2F4F4F',name:'深青灰'},{color:'#A0522D',name:'赭'},{color:'#BA55D3',name:'暗兰花'}],
						 [{color:'#6A5ACD',name:'青蓝'},{color:'#CD5C5C',name:'印地安红'},{color:'#FF6347',name:'蕃茄红'},{color:'#006400',name:'深绿'},{color:'#7B68EE',name:'暗青蓝'},{color:'#D2691E',name:'巧克力'},{color:'#696969',name:'淡灰'},{color:'#FF69B4',name:'热粉红'},{color:'#4169E1',name:'品蓝'},{color:'#556B2F',name:'深橄榄绿'},{color:'#DB7093',name:'淡紫红'},{color:'#DA70D6',name:'兰花紫'},{color:'#9370DB',name:'暗紫'},{color:'#FF7F50',name:'珊瑚红'}],
						 [{color:'#008000',name:'绿'},{color:'#808000',name:'橄榄'},{color:'#FA8072',name:'淡橙红'},{color:'#008080',name:'水鸭绿'},{color:'#808080',name:'灰'},{color:'#F08080',name:'浅珊瑚红'},{color:'#708090',name:'青灰'},{color:'#4682B4',name:'钢青'},{color:'#EE82EE',name:'紫罗兰'},{color:'#CD853F',name:'秘鲁褐'},{color:'#B8860B',name:'深金黄'},{color:'#778899',name:'浅青灰'},{color:'#228B22',name:'森林绿'},{color:'#2E8B57',name:'海藻绿'}],
						 [{color:'#008B8B',name:'深青'},{color:'#FF8C00',name:'深桔黄'},{color:'#6B8E23',name:'橄榄褐'},{color:'#BC8F8F',name:'蔷薇褐'},{color:'#1E90FF',name:'宝蓝'},{color:'#6495ED',name:'矢车菊蓝'},{color:'#E9967A',name:'深橙红'},{color:'#5F9EA0',name:'藏青'},{color:'#FFA07A',name:'浅橙红'},{color:'#DDA0DD',name:'梅红'},{color:'#F4A460',name:'沙褐'},{color:'#FFA500',name:'橙'},{color:'#DAA520',name:'金黄'},{color:'#A9A9A9',name:'深灰'}],
						 [{color:'#20B2AA',name:'浅海藻绿'},{color:'#3CB371',name:'暗海藻绿'},{color:'#D2B48C',name:'茶'},{color:'#FFB6C1',name:'浅粉红'},{color:'#BDB76B',name:'深黄褐'},{color:'#DEB887',name:'原木'},{color:'#8FBC8F',name:'深海藻绿'},{color:'#D8BFD8',name:'蓟'},{color:'#00BFFF',name:'深天蓝'},{color:'#C0C0C0',name:'银'},{color:'#FFC0CB',name:'粉红'},{color:'#B0C4DE',name:'浅钢青'},{color:'#32CD32',name:'暗绿'},{color:'#9ACD32',name:'黄绿'}],
						 [{color:'#66CDAA',name:'暗碧绿'},{color:'#00CED1',name:'深粉蓝'},{color:'#87CEEB',name:'天蓝'},{color:'#87CEFA',name:'浅天蓝'},{color:'#48D1CC',name:'暗粉蓝'},{color:'#D3D3D3',name:'浅灰'},{color:'#FFD700',name:'金'},{color:'#ADD8E6',name:'浅蓝'},{color:'#FFDAB9',name:'粉桃红'},{color:'#DCDCDC',name:'亮灰'},{color:'#FFDEAD',name:'印地安黄'},{color:'#F5DEB3',name:'麦'},{color:'#40E0D0',name:'宝石绿'},{color:'#B0E0E6',name:'浅灰蓝'}],
						 [{color:'#FFE4B5',name:'鹿皮黄'},{color:'#FFE4C4',name:'淡黄'},{color:'#FFE4E1',name:'粉玫瑰红'},{color:'#F0E68C',name:'黄褐'},{color:'#E6E6FA',name:'淡紫'},{color:'#EEE8AA',name:'淡金黄'},{color:'#FFEBCD',name:'杏仁白'},{color:'#FAEBD7',name:'古董白'},{color:'#90EE90',name:'浅绿'},{color:'#AFEEEE',name:'淡蓝绿'},{color:'#FFEFD5',name:'粉木瓜橙'},{color:'#FAF0E6',name:'灰白'},{color:'#FFF0F5',name:'淡紫红'},{color:'#F5F5DC',name:'米黄'}],
						 [{color:'#FDF5E6',name:'旧布黄'},{color:'#FFF5EE',name:'贝壳白'},{color:'#F5F5F5',name:'白雾'},{color:'#FFF8DC',name:'玉米穗黄'},{color:'#F0F8FF',name:'艾丽丝蓝'},{color:'#F8F8FF',name:'苍白'},{color:'#00FA9A',name:'暗嫩绿'},{color:'#FFFACD',name:'粉黄'},{color:'#FAFAD2',name:'浅金黄'},{color:'#FFFAF0',name:'花白'},{color:'#FFFAFA',name:'雪白'},{color:'#98FB98',name:'淡绿'},{color:'#7CFC00',name:'草绿'},{color:'#00FF00',name:'亮绿'}],
						 [{color:'#7FFF00',name:'酒黄绿'},{color:'#FFFF00',name:'黄'},{color:'#ADFF2F',name:'绿黄'},{color:'#00FF7F',name:'嫩绿'},{color:'#7FFFD4',name:'碧绿'},{color:'#FFFFE0',name:'浅黄'},{color:'#F0FFF0',name:'蜜瓜白'},{color:'#FFFFF0',name:'象牙白'},{color:'#F5FFFA',name:'薄荷乳白'},{color:'#00FFFF',name:'浅绿'},{color:'#00FFFF',name:'青'},{color:'#E0FFFF',name:'浅青'},{color:'#F0FFFF',name:'蔚蓝'},{color:'#FFFFFF',name:'白'}]
						];
	var i,j;
	var table, tbody, tr, td;
	var color;
	
	table = Palette.createElement('TABLE', {id:'ColorPalette_Pop140', border:0, cellPadding:0, cellSpacing:1}, {cursor:'pointer', backgroundColor:'#000000', display:'none'});
	
	tbody = Palette.createElement('TBODY');
	
	for (var i=0; i<popularColors.length; i++)
	{
		tr = Palette.createElement('TR');
		for (var j=0; j<popularColors[i].length; j++)
		{
			color = popularColors[i][j];
			td = Palette.createElement('TD', {width:15, height:12}, {backgroundColor:color.color});
			td.setAttribute('name', color.name);
			td.setAttribute('color', color.color);
			Palette.addListener(td, 'mouseover', Palette.__MouseOver);
			Palette.addListener(td, 'mouseout', Palette.__MouseOut);
			Palette.addListener(td, 'click', Palette.__PickColor);
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody)
	return table;
}

Palette.__MouseMove = function(ev)
{
	ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	if (target.nodeName != 'DIV')
	{
		while (!(target.nodeName == 'TABLE' && (target.id == 'ColorPalette_Web216' || target.id == 'ColorPalette_Pop140')))
		{
			target = target.parentNode;
		}
	}
	
	if (target.nodeName != 'TABLE')
	{
		var picker = document.getElementById(document.getElementById('ColorPalette').getAttribute('palette'));
		document.getElementById('ColorPalette_CurrentColor').style.backgroundColor = picker.getAttribute('color');
		document.getElementById('ColorPalette_ColorName').innerHTML = picker.getAttribute('name');
	}
}

Palette.__MouseOver = function(ev)
{
	ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	target.style.backgroundImage = 'url(' + Palette.$images['over' + document.getElementById('ColorPalette_SwitchButton').getAttribute('palette')] + ')';
	document.getElementById('ColorPalette_CurrentColor').style.backgroundColor = target.getAttribute('color');
	document.getElementById('ColorPalette_ColorName').innerHTML = target.getAttribute('name');
}

Palette.__MouseOut = function(ev)
{
	ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	target.style.backgroundImage = '';
}

Palette.__SwitchPalette = function()
{
	var button = document.getElementById('ColorPalette_SwitchButton');
	var palette = button.getAttribute('palette');
	if (palette == '216')
	{
		document.getElementById('ColorPalette_Web216').style.display = 'none';
		document.getElementById('ColorPalette_Pop140').style.display = '';
		button.setAttribute('palette', '140');
		document.getElementById('ColorPalette_Console').style.width = document.getElementById('ColorPalette_Pop140').offsetWidth + 'px';
	}
	else if (palette == '140')
	{
		document.getElementById('ColorPalette_Web216').style.display = '';
		document.getElementById('ColorPalette_Pop140').style.display = 'none';
		button.setAttribute('palette', '216');
		document.getElementById('ColorPalette_Console').style.width = document.getElementById('ColorPalette_Web216').offsetWidth + 'px';
	}
}

//Palette.addListener(document.body, 'click', 
//	function(ev)
//	{
//		ev = ev || window.event;
//		var target = ev.target || ev.srcElement;
//		if (document.getElementById('ColorPalette').style.display == '')
//		{			
//			while (target.id != 'ColorPalette' && target.nodeName != 'BODY')
//			{
//				target = target.parentNode;
//			}
//			
//			if (target.nodeName == 'BODY')
//			{
//				document.getElementById('ColorPalette').style.display = 'none';
//			}
//		}
//	});

Palette.__PickColor = function(ev)
{
	var picker = document.getElementById(document.getElementById('ColorPalette').getAttribute('palette'));
	
	ev = ev || window.event;
	var target = ev.target || ev.srcElement;
	if (target.nodeName == 'TD')
	{
		picker.style.backgroundColor = target.getAttribute('color');
		picker.setAttribute('name', target.getAttribute('name'));
		
		if (document.palettes[picker.id].textBox != null)
		{
			document.palettes[picker.id].textBox.value = target.getAttribute('color');
		}
	}
	Palette.__HidePatelle();
}

Palette.__ClearColor = function()
{
	var picker = document.getElementById(document.getElementById('ColorPalette').getAttribute('palette'));
	picker.style.backgroundColor = '';
	picker.setAttribute('name', '');
	
	if (document.palettes[picker.id].textBox != null)
	{
		document.palettes[picker.id].textBox.value = '';
	}
	
	Palette.__HidePatelle();
}

function __InitializePalettes()
{
	/// <summary>初始化document.palettes并呈现页面上所有Palette</summary>
	
	//生成ColorPattle
	var div, table, tbody, tr, td, input;
	div = Palette.createElement('DIV', {id:'ColorPalette'}, {position:'absolute', zIndex:1, padding:'5px', border:'1px solid #000000', backgroundColor:'#ECE9E8', visibility:'hidden' ,display:'none'});
	Palette.addListener(div, 'mouseout', Palette.__MouseMove);
	table = Palette.createElement('TABLE', {id:'ColorPalette_Console', border:0, cellPadding:0, cellSpacing:0}, {marginBottom:'4px'});
	tbody = Palette.createElement('TBODY');
	tr = Palette.createElement('TR');
	td = Palette.createElement('TD', {id:'ColorPalette_CurrentColor', width:50, title:'当前颜色', innerHTML:'&nbsp;'}, {border:'1px solid #000000'});
	tr.appendChild(td);
	td = Palette.createElement('TD', {align:'center', id:'ColorPalette_ColorName', width:80, innerHTML:'&nbsp;'}, {fontSize:'11px', fontFamily:'verdana', textTransform:'uppercase'});
	tr.appendChild(td);
	td = Palette.createElement('TD');
	input = Palette.createElement('INPUT', {type:'button', id:'ColorPalette_ClearButton', title:'清除颜色'}, {backgroundColor:'transparent', borderWidth:'1px', borderStyle:'solid', borderColor:'#FFFFFF #404040 #404040 #FFFFFF', width:'16px', height:'16px', backgroundImage:'url(' + Palette.$images.clearButton + ')', backgroundRepeat:'no-repeat'});
	Palette.addListener(input, 'click', Palette.__ClearColor);	
	td.appendChild(input);
	tr.appendChild(td);	
	td = Palette.createElement('TD', {align:'right'});
	input = Palette.createElement('INPUT', {type:'button', id:'ColorPalette_SwitchButton', title:'切换色板'}, {backgroundColor:'transparent', borderWidth:'1px', borderStyle:'solid', borderColor:'#FFFFFF #404040 #404040 #FFFFFF', width:'16px', height:'16px', backgroundImage:'url(' + Palette.$images.switchButton + ')', backgroundRepeat:'no-repeat'});
	input.setAttribute('palette', '216');
	Palette.addListener(input, 'click', Palette.__SwitchPalette);
	td.appendChild(input);
	input = Palette.createElement('INPUT', {type:'button', title:'关闭'}, {backgroundColor:'transparent', borderWidth:'1px', borderStyle:'solid', borderColor:'#FFFFFF #404040 #404040 #FFFFFF', width:'16px', height:'16px', backgroundImage:'url(' + Palette.$images.closeButton + ')', backgroundRepeat:'no-repeat'});
	Palette.addListener(input, 'click', Palette.__HidePatelle);
	td.appendChild(input);
	tr.appendChild(td);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	//Web216
	table = Palette.createElement('TABLE', {id:'ColorPalette_Web216', border:0, cellPadding:0, cellSpacing:0}, {backgroundColor:'#000000'});
	
	tbody = Palette.createElement('TBODY');
	tr = Palette.createElement('TR');
	td = Palette.createElement('TD');
	td.appendChild(Palette.__GetStandardColors());		
	tr.appendChild(td);
	td = Palette.createElement('TD');
	td.appendChild(Palette.__GetSafettyColors());
	tr.appendChild(td);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);
	
	//Pop140
	div.appendChild(Palette.__GetPopularColors());
		
	document.body.appendChild(div);
	
	var palettes = document.getElementsByTagName('Palette');
	var palette;
	for(var i=0; i<palettes.length; i++)
	{
		palette = new Palette();
		palette.id = palettes[i].getAttribute('ID');
		palette.textBox = palettes[i].getAttribute('TextBox');
		palette.color = palettes[i].getAttribute('Color');
		palette.onchange = palettes[i].getAttribute('OnChange');
		palette.element = palettes[i];
		palette.initialize();
	}	
}
__InitializePalettes();