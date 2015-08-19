clearForm("formEditor");

//缓存有级联关系的下拉框的值
<rows-cascade-edit>
	var obj = document.formEditor.${fld:field_code};
	if(typeof(obj) != "undefined"){
		obj.options.length = 0;
		var children = domainArray["${fld:field_code}"];
		for(var i=0;i<children.length;i++){
			var a = children[i];
			option = new Option(a[1],a[0]);
			obj.options.add(option);
		}
	}
</rows-cascade-edit>

document.formEditor.__pk_value__.value = "${fld:__pk_value__}";
document.formEditor.__p_pk_value__.value = "${fld:__p_pk_value__}";

${controls}

//判断如果是版本还原的话
if("${fld:snapshot}" != ""){
	document.forms["formEditor"].elements["submitCommand"].style.display='none';
	document.forms["formEditor"].elements["deleteCommand"].style.display='none';
}else{
	//判断是否是看明细
	if("${fld:is_show_detail}" == "1"){
		document.forms["formEditor"].elements["submitCommand"].style.display='none';
		document.forms["formEditor"].elements["deleteCommand"].style.display='none';
	}else{
		document.forms["formEditor"].elements["submitCommand"].style.display='${fld:is_can_update}';
		document.forms["formEditor"].elements["deleteCommand"].style.display='${fld:is_can_delete}';
	}
}
var wfm_id = document.formEditor.__wfm_id__.value;
//判断流程编号存在则显示流程办理按钮
if(wfm_id != ""){
	document.getElementById("workflowCommand").style.display = "";
	document.getElementById("showCommentCommand").style.display = "";
	if("${fld:is_show_detail}" != "1"){
		document.getElementById("wfmCommand").style.display = "";
		document.getElementById("dealCommentCommand").style.display = "";
		//传阅先不显示
		//document.getElementById("circulateCommand").style.display = "";
		//判断当前是否是会签单
		if(document.formEditor.__parent_wfentry_id__.value != ""){
			document.getElementById("dealParentCommentCommand").style.display = "";
			document.getElementById("showCommentCommand").value = "查看黄条";
			document.getElementById("dealCommentCommand").value = "签署黄条";
		}
	}
}else{
	document.getElementById("wfmCommand").style.display = "none";
	document.getElementById("dealCommentCommand").style.display = "none";
	document.getElementById("showCommentCommand").style.display = "none";
	document.getElementById("dealParentCommentCommand").style.display = "none";
	document.getElementById("workflowCommand").style.display = "none";
	document.getElementById("circulateCommand").style.display = "none";
}

$("#divEditor").show();