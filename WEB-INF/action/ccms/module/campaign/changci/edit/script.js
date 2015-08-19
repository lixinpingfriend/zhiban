document.formEditor.tuid.value = "${fld:tuid}";
document.formEditor.changci_name1.value = "${fld:changci_name@js}";
document.formEditor.changci_time.value = "${fld:changci_time@js}";
document.formEditor.regist_from_time.value = "${fld:regist_from_time@js}";
document.formEditor.regist_from_time_date.value = "${fld:regist_from_time_date@js}";
document.formEditor.regist_from_time_hour.value = "${fld:regist_from_time_hour@js}";
document.formEditor.regist_from_time_minute.value = "${fld:regist_from_time_minute@js}";
document.formEditor.regist_to_time.value = "${fld:regist_to_time@js}";
document.formEditor.regist_to_time_date.value = "${fld:regist_to_time_date@js}";
document.formEditor.regist_to_time_hour.value = "${fld:regist_to_time_hour@js}";
document.formEditor.regist_to_time_minute.value = "${fld:regist_to_time_minute@js}";
getChildDomainByChild("Province","province","City","event_city","${fld:event_city}");
document.formEditor.car_series.value = "${fld:car_series}";
document.formEditor.remark.value = "${fld:remark@js}";
document.formEditor.show_order.value = "${fld:show_order}";
document.formEditor.changci_quota.value = "${fld:changci_quota}";


document.forms["formEditor"].getElementsByTagName("span")[0].innerHTML = "修改站点信息";
document.forms["formEditor"].elements["deleteCommand"].style.display='';
document.getElementById("divEditor").style.display='';