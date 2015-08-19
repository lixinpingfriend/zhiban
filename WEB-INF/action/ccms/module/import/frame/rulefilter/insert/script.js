/*$Dialog().notice("新增成功！",1500,function(){
	window.parent.location.reload();
});*/

$Dialog().notice("保存成功！",1000, function(){
	parent.$("#_dlgchildNode").modal("hide");
	parent.searchObj.searchData(1);
});
