﻿var objId = document.getElementById("${fld:id}");
if(typeof(objId) != "undefined"){
	objId.options.length = 0;
	option = new Option("请选择...");
	option.value = "";
	objId.options.add(option);
	<rows>
		option = new Option("${fld:wfm_name}");
		option.value = "${fld:tuid}";
		objId.options.add(option);
	</rows>
}else{
	$Dialog().alert("请确认编号元素(${fld:id})是否存在！");
}