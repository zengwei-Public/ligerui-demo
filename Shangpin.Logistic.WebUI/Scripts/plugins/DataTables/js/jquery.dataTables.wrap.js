function InitDataTable(conf) {
    var opts=
        {
            "target": '#DataTables',
		    "bProcessing": true,
            "bServerSide": true,
//            "sAjaxSource": "@Url.Action("AjaxHandler")",
//             "sAjaxSource": "/Common/id.txt",                
//            "aoColumns": [
//                    { "sName": "ID",
//                        "bSearchable": false,
//                        "bSortable": false,
//                        "fnRender": function (oObj) {
//                            return '<input type="checkbox" value="'+oObj.aData[0]+'" />';
//                        }
//                    },
//                    { "sName": "COMPANY_NAME" },
//                    { "sName": "ADDRESS" },
//                    { "sName": "TOWN" }
//                ],

            "bSort": false,
            "sScrollY": 300,
//            "sScrollX": "100%",
//            "sScrollXInner": "100%",
            "iDisplayLength": 25,
            "sPaginationType": "full_numbers",
            "sDom": '<"toolbar"TCfr>t<"botbar"pli>',
            "oTableTools": {
                "sSwfPath": "/Scripts/plugins/DataTables/extras/TableTools/swf/copy_cvs_xls_pdf.swf",
                "aButtons": [ 
//                        {
//                        "sExtends":    "text","sButtonText": "添加",
//                        "sButtonClass":"DTTT_button_add",
//                        "sButtonClassHover":"DTTT_button_add_hover",
//                        "fnClick": function ( nButton, oConfig, oFlash ) {
//                         //   popup("测试", "id:testID", "500", "auto", "id");
//                        }
//                    },
//                        {
//                        "sExtends":    "text","sButtonText": "删除",
//                        "sButtonClass":"DTTT_button_del",
//                        "sButtonClassHover":"DTTT_button_del_hover",
//                        "fnClick": function ( nButton, oConfig, oFlash ) {
//                            alert( 'Del' );
//                        }
//                    },
//				    {"sExtends": "print","sButtonText": "打印"}, 
//				    {"sExtends":    "collection","sButtonText": "导出","aButtons":    [ "xls", "pdf" ]} ,
				    {"sExtends": "copy", "sButtonText": "复制" },
				    { "sExtends": "xls", "sButtonText": "导出" }
                ]
            },
	        "oColVis": {
                //  "activate": "mouseover",
                "buttonText": "&nbsp;",
                "aiExclude": [ 0 ],
                "bRestore": true,
                "sRestore": "还原默认列",
			    "sAlign": "right",
                "sSize": "css"
	        },
            "oLanguage": {
	            "sProcessing": "数据加载中，请等待...",
	            "sLengthMenu": "每页显示 _MENU_ 条数据",
	            "sZeroRecords": "没有可显示数据",
	            "sInfo": "显示第 _START_ - _END_ / _TOTAL_ 条数据",
	            "sInfoEmpty": "显示 0 条数据",
	            "sInfoFiltered": "",
	            "sInfoPostFix": "",
	            "sSearch": "搜索",
	            "sUrl": "",
	            "oPaginate": {
		            "sFirst":    "首页",
		            "sPrevious": "上一页",
		            "sNext":     "下一页",
		            "sLast":     "尾页"
	            }
		    },
		    "fnRowCallback": function (nRow, aData, iDisplayIndex) {
//		        $('td:eq(4)', nRow).width(250);
		        return nRow;
		    },
		    "fnDrawCallback": function (oSettings) {
		        this.fnAdjustColumnSizing(false);
//                if (oSettings.bSorted || oSettings.bFiltered) {
//                    for (var i = 0, iLen = oSettings.aiDisplay.length; i < iLen; i++) {
//                        var h = '<input type="checkbox" />';
//                        $('td:eq(0)', oSettings.aoData[oSettings.aiDisplay[i]].nTr)
//                            .html(h)
//                            .addClass("CbxColumn");
//                    }
//                }
            }
        };

        $.extend(opts, conf);
        return $(opts.target).dataTable(opts);
}