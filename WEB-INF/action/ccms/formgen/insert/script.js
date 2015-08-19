if("${fld:__wfm_id__}"!="" && "${fld:wfentry_id}" != ""){
	$("#formEditor_${fld:form_id} input[name='__wfentry_id__']").val("${fld:wfentry_id}");
	$("#formEditor_${fld:form_id} input[name='__current_step_id__']").val("${fld:current_step_id}");
}