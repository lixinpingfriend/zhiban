clearForm("formEditor");
document.formEditor.userlogin.value ="${fld:userlogin@js}";
document.formEditor.fname.value = "${fld:fname@js}";
setCheckboxValue("force_newpass","${fld:force_newpass}","formEditor");
<role-list>
	setCheckboxValue("role_id","${fld:role_id}","formEditor");
</role-list>

document.getElementById("passwdtr").style.display = 'none';
document.getElementById("confirmtr").style.display='none';
document.formEditor.tenantry_name.value="${fld:name}";
document.formEditor.dep_id.value="${fld:dep_id}";
document.formEditor.tuid.value = "${fld:user_id}";
document.formEditor.user_id.value = "${fld:user_id}";
document.formEditor.userlogin.disabled = true;