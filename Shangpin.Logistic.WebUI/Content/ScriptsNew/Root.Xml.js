//-----------------------------------------------------------------------
// Copyright (C) wwwRoot.cn, All rights reserved.
//-----------------------------------------------------------------------
// Root.Xml.js
// �첽����Xml
// Xml.Request

Xml = new Object();
Xml.Request = function(url, data, command, args, breakOther)
{	
	/// <summary>����һ��Xml�ļ���ִ���¼�</summary>
	/// <param name="url" type="String" mayBeNull="false">�����Xml��ַ</param>
	/// <param name="data" type="String" mayBeNull="true">
	///		�κ���ͨ��"POST"���͸�������������
	///		���ַ�������ʽ��, ��: name=value&anothername=othervalue&so=on, ʹ��Request.Form����
	///		Ϊnullʱͨ��"GET"����url, ʹ��Request.QueryString����
	///	</param>
	/// <param name="command" type="CommandQueue|Function|String|Object|Element" mayBeNull="true">
	///		�����������(����Root.CommandQueue.js��֧��)��������Ԫ�ػ������ַ���
	///		��Ϊ�����ַ���ʱ, ֧��[Xml]��[Text]ռλ��, �ֱ����responseXML��responseText
	/// </param>
	/// <param name="args" type="CommandQueueIndex|FunctionArguments|Null|ObjectMethod" mayBeNull="true">
	///		��commandΪ�����������ʱ, args ��ʾ�������ִ�е�����
	///		��commandΪ����ʱ, args ��ʾ�����Ĳ������������
	///		��commandΪ�����ַ���ʱ, args ��Ч
	///		��commandΪ����ʱ, argsΪ��command��ʾԪ��, args��Ϊ��command��ʾ�Զ���������, ��ʱargs��ʾ�����һ������
	/// </param>
	
	var i; //ѭ������
	
	//�ж����õ�ַ�ǲ�����ͬһ������
	var rex = new RegExp('^http:/' + '/');
	rex.ignoreCase = true;
	if(rex.test(url))
	{
		var domain = url.replace(rex, '').toLowerCase();
		var index = domain.indexOf('/');
		if(index > -1) domain = domain.substring(0, index);
		
		if(domain != window.location.host)
		{
			//�õ���ǰ�ű�������·��
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
	
	//���������Ϊ��ÿ��ˢ�¶���������Xml�ļ�
	url += (url.indexOf('?') > 0)? '&':'?';
	url += Math.random();
	
	//�ж���������
	if (breakOther)
	{		

	}
	
	var xmlRequest;
	
	//�ж��������ʲô����	
	if (window.XMLHttpRequest)
	{
		//Mozilla,Firefox,Safari,IE 7 �����, ���Ĳ�����
		xmlRequest = new XMLHttpRequest();
		if(xmlRequest.overrideMimeType)
		{
			xmlRequest.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject)
	{
		//IE ���ĵ����������
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
		//�������׼��״̬�ı�ʱ......
		xmlRequest.onreadystatechange = function()
		{
			// readyState
			// 0 (δ��ʼ��) unintialized
			// 1 (����װ��) loading
			// 2 (װ�����) loaded
			// 3 (������) interactive
			// 4 (���) complete
			
			if (xmlRequest.readyState == 4)
			{	
				if(xmlRequest.status == 0 || (xmlRequest.status >= 200 && xmlRequest.status < 300))
				//if(xmlRequest.status == 200)
				{
					//��һ�ж�OK��, �͸ɵ���
					if (command != null)
					{				
						//��������
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
						//�ַ�������
						else if (typeof(command) == 'string')
						{
							//�����ַ���
							command = command.replace('[Xml]', 'xmlRequest.responseXML');
							command = command.replace('[Text]', 'xmlRequest.responseText');					
								
							eval(command);								
						}
						//��������
						else if (typeof(command) == 'object')
						{
							//Ԫ��
							if(args == null)
							{
								if(command.id && command.innerHTML)
								{
									command.innerHTML = xmlRequest.responseText;
								}
							}
							//����
							else if(command[args])
							{
								command[args](xmlRequest);									
							}
						}											
					}
				}
				else
				{
					//�򵥴�����
					window.alert('ErrorCode:' + xmlRequest.status + '\r\n' + 'ErrorMessage:' + xmlRequest.statusText);
					window.open(url);
				}
			}
		};

		//open�����������������������Ƿ�Ϊ�첽ģʽ.�����true, JavaScript����������ִ��,�����ȴ���������Ӧ		
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
		
		//���浱ǰ����
		document.request = xmlRequest;
	}
	else
	{
		window.alert('GOD SAY: YOUR BROWSER IS TOO OLD!');
	}
}