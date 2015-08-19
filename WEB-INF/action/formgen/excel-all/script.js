//将查询类型状态置为界面输出
document.formFilter.__search_type__.value = "0";
if(typeof(searchBackSetting)=="function"){
	searchBackSetting();
}
showDiv("response");

var features = "height=500,width=800,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes";
var url = "${def:context}${def:actionroot}/excel?document_id=${fld:uniquegen}&recordcount=${fld:recordcount}&random=" + Math.random();
var w = window.open(url, null, features);