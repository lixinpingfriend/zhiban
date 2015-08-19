document.forms["formEditor"].elements["deleteCommand"].style.display='none';
$("#divStatus").hide();
clearForm("formEditor");

alert("信息保存成功！");

var __search_action__ = "8";

//先给业务主键赋值
document.formEditor.__pk_value__.value = "${fld:bpk_field_value}";

//新增之后执行JS
${fld:insert_js}

//再清除业务主键
document.formEditor.__pk_value__.value = "";

//如果是工单界面,则跳到修改界面
if("${fld:__wfm_id__}"!="" && "${fld:wfentry_id}" != ""){
	//首先给流程实例和当前步骤赋值
	document.formEditor.__wfentry_id__.value = "${fld:wfentry_id}";
	document.formEditor.__current_step_id__.value = "${fld:current_step_id}";
	editFormGen("${fld:bpk_field_value}","${fld:form_id}","${fld:__p_pk_value__}");
}else{
	//判断新增之后执行什么操作
	if(checkFormAction(__search_action__)){
		if(formLoaded("divFilter","loaded")){
			search();
		}else{
			$("#divEditor").hide();
		}
	}
}