﻿clearForm("formEditor");

document.formEditor.vip_userlogin_2.value = "${fld:parent_user}";
document.formEditor.vip_name_2.value = "${fld:names}";

document.formEditor.tuid.value = "${fld:tuid}";
document.formEditor.user_id.value = "${fld:user_id}";
document.formEditor.del_user_id.value = "${fld:user_id}";
document.formEditor.userlogin.value = "${fld:userlogin@js}";
document.formEditor.name.value = "${fld:name@js}";
document.formEditor.user_pinyin.value = "${fld:user_pinyin@js}";
setCheckboxValue("sex","${fld:sex}","formEditor");
document.formEditor.locale.value="${fld:locale@js}";

document.formEditor.birthday.value = "${fld:birthday}";
document.formEditor.entry_date.value = "${fld:entry_date@yyyy-MM-dd}";
document.formEditor.contract_from.value = "${fld:contract_from@yyyy-MM-dd}";
document.formEditor.contract_end.value = "${fld:contract_end@yyyy-MM-dd}";

document.formEditor.address.value = "${fld:address@js}";
document.formEditor.card_no.value = "${fld:card_no@js}";
document.formEditor.hourly_rate.value = "${fld:hourly_rate}";
document.formEditor.remark.value = "${fld:remark@js}";
document.formEditor.email.value = "${fld:email@js}";
document.formEditor.mobile.value = "${fld:mobile@js}";

<skill-list>
	setCheckboxValue("skill_id","${fld:skill_id}","formEditor");
</skill-list>
setComboValue("staff_category","${fld:staff_category}","formEditor");


if("2"=="${fld:staff_category}"){
	document.getElementById("viplist").style.display = "";
	document.formEditor.vipuserlogin.value = "${fld:parent_user}";
	document.formEditor.vipname.value = "${fld:names}";
	}else{
		document.getElementById("viplist").style.display = "none";
		}
$("#passwd_tr").hide();
$("#confirm_tr").hide();
$("#pwd_policy_tr").hide();
document.formEditor.userlogin.disabled=true;
