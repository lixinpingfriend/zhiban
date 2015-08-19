$Dialog().notice("保存成功！",1000, function(){
	parent.$("#_dlgcopyForm").modal("hide");
	parent.searchObj.searchData(1);
});
