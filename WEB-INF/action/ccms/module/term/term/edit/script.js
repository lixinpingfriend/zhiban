document.formEditor.tuid.value = "${fld:tuid}";
document.formEditor.term_name.value = "${fld:term_name@js}";
document.formEditor.remark.value = "${fld:remark@js}";
document.formEditor.pre_class.value = "${fld:pre_class@js}";
document.formEditor.post_class.value = "${fld:post_class@js}";
document.formEditor.logo_path.value = "${fld:logo_path@js}";


setCheckboxValue("term_type","${fld:term_type@js}","formEditor");
setCheckboxValue("status","${fld:status@js}","formEditor");
