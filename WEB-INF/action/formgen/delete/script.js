document.getElementById("divEditor").style.display='none';
document.forms["formEditor"].elements["deleteCommand"].style.display='none';
$("#divStatus")[0].style.display='none';
clearForm("formEditor");

alert("删除成功！");

//判断删除之后执行什么操作
if(checkFormAction("32")){
	if(formLoaded("divFilter","loaded")){
		search();
	}
}