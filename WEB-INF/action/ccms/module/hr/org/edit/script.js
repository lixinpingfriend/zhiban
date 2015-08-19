clearForm("formEditor");

document.formEditor.tuid.value = "${fld:org_id}";
document.formEditor.org_name.value = "${fld:org_name@js}";
document.formEditor.remark.value = "${fld:remark@js}";
document.formEditor.show_order.value = "${fld:show_order}";
document.formEditor.short_name.value = "${fld:short_name@js}";

setComboValue("org_grade","${fld:org_grade@js}","formEditor");
setCheckboxValue("org_type","${fld:org_type@js}","formEditor");