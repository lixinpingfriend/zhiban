document.getElementById("divEditor").style.display='none';
document.forms["formEditor"].getElementsByTagName("span")[0].innerHTML = "新增场次信息";
document.forms["formEditor"].elements["deleteCommand"].style.display='none';
clearForm("formEditor");
//document.formFilter.alias.focus();
//alert ('El registro fue a馻dido en la base de datos');
search();

