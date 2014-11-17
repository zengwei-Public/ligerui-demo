//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.Xml.js
// 异步请求Xml
// Xml.Request

Xml = new Object();
Xml.Request = function(url, data, command, args, breakOther)
{	
	/// <summary>请求一个Xml文件并执行事件</summary>
	/// <param name="url" type="String" mayBeNull="false">请求的Xml地址</param>
	/// <param name="data" type="String" mayBeNull="true">
	///		任何想通过"POST"发送给服务器的数据
	///		以字符串的形式送, 如: name=value&anothername=othervalue&so=on, 使用Request.Form接收
	///		为null时通过"GET"请求url, 使用Request.QueryString接收
	///	</param>
	/// <param name="command" type="CommandQueue|Function|String|Object|Element" mayBeNull="true">
	///		命令队列名称(仅在Root.CommandQueue.js中支持)、函数、元素或命令字符串
	///		当为命令字符串时, 支持[Xml]和[Text]占位符, 分别代表responseXML和responseText
	/// </param>
	/// <param name="args" type="CommandQueueIndex|FunctionArguments|Null|ObjectMethod" mayBeNull="true">
	///		当command为命令队列名称时, args 表示命令队列执行的索引
	///		当command为函数时, args 表示函数的参数或参数数组
	///		当command为命令字符串时, args 无效
	///		当command为对象时, args为空command表示元素, args不为空command表示自定义类或对象, 这时args表示对象的一个方法
	/// </param>
	
	var i; //循环变量
	
	//判断引用地址是不是在同一个域下
	var rex = new RegExp('^http:/' + '/');
	rex.ignoreCase = true;
	if(rex.test(url))
	{
		var domain = url.replace(rex, '').toLowerCase();
		var index = domain.indexOf('/');
		if(index > -1) domain = domain.substring(0, index);
		
		if(domain != window.location.host)
		{
			//得到当前脚本的引用路径
			var scripts = document.getElementsByTagName('SCRIPT');
			var path;
			for (i=0; i<scripts.length; i++)
			{
				if (scripts[i].src.indexOf('Root.Xml.js') > -1)
				{
					path = scripts[i].src;
					break;
				}
			}			
			path = path.substring(0, path.lastIndexOf('/') + 1);
			
			url = path + 'Root.Xml.aspx?url=' + escape(url);
		}
	}
	
	//加随机数是为了每次刷新都重新载入Xml文件
	url += (url.indexOf('?') > 0)? '&':'?';
	url += Math.random();
	
	//中断其他请求
	if (breakOther)
	{		

	}
	
	var xmlRequest;
	
	//判断浏览器是什么牌子	
	if (window.XMLHttpRequest)
	{
		//Mozilla,Firefox,Safari,IE 7 浏览器, 万恶的不兼容
		xmlRequest = new XMLHttpRequest();
		if(xmlRequest.overrideMimeType)
		{
			xmlRequest.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject)
	{
		//IE 核心的浏览器适用
		var MSXML = new Array('MSXML2.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.5.0');
		for (i=0; i<MSXML.length; i++)
		{
			try
			{		
				xmlRequest = new ActiveXObject(MSXML[i]);				
				break;
			}
			catch(e)
			{
				xmlRequest = null;
			}	
			//xmlRequest.setRequestHeader("Content-Type","text/xml");			
		}
	}
	
	if (xmlRequest != null)
	{
		//当请求的准备状态改变时......
		xmlRequest.onreadystatechange = function()
		{
			// readyState
			// 0 (未初始化) unintialized
			// 1 (正在装载) loading
			// 2 (装载完毕) loaded
			// 3 (交互中) interactive
			// 4 (完成) complete
			
			if (xmlRequest.readyState == 4)
			{	
				if(xmlRequest.status == 0 || (xmlRequest.status >= 200 && xmlRequest.status < 300))
				//if(xmlRequest.status == 200)
				{
					//当一切都OK了, 就干点活吧
					if (command != null)
					{				
						//函数类型
						if (typeof(command) == 'function')
						{
							if (args != null && args instanceof Array)
							{
								command.apply(xmlRequest, args);
							}							
							else
							{
								command.call(xmlRequest, args);
							}
						}							
						//字符串类型
						else if (typeof(command) == 'string')
						{
							//命令字符串
							command = command.replace('[Xml]', 'xmlRequest.responseXML');
							command = command.replace('[Text]', 'xmlRequest.responseText');					
								
							eval(command);								
						}
						//对象类型
						else if (typeof(command) == 'object')
						{
							//元素
							if(args == null)
							{
								if(command.id && command.innerHTML)
								{
									command.innerHTML = xmlRequest.responseText;
								}
							}
							//对象
							else if(command[args])
							{
								command[args](xmlRequest);									
							}
						}											
					}
				}
				else
				{
					//简单错误处理
					window.alert('ErrorCode:' + xmlRequest.status + '\r\n' + 'ErrorMessage:' + xmlRequest.statusText);
					window.open(url);
				}
			}
		};

		//open方法第三个参数设置请求是否为异步模式.如果是true, JavaScript函数将继续执行,而不等待服务器响应		
		if (data == null)
		{			
			xmlRequest.open('GET', url, true);
			xmlRequest.send(null);
		}
		else
		{	
			xmlRequest.open('POST',url,true);
			xmlRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
			xmlRequest.send(data);
		}
		
		//保存当前请求
		document.request = xmlRequest;
	}
	else
	{
		window.alert('GOD SAY: YOUR BROWSER IS TOO OLD!');
	}
}