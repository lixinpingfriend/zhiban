$("#divStatus").hide();

//判断如果执行了流程办理则弹出流程界面
if("${fld:__wfm_id__}" != "" && "${fld:__dowfm__}" == "1"){

	${fld:update_js}

	dealWfm("${fld:__pk_value__}");
}else{
	document.forms["formEditor"].elements["deleteCommand"].style.display='none';
	alert("信息保存成功！");

	${fld:update_js}

	var __search_action__ = "16";

	//判断修改之后执行什么操作
	if(checkFormAction(__search_action__)){
		if(formLoaded("divFilter","loaded")){
			search();
		}else{
			$("#divEditor").hide();
		}
	}
}