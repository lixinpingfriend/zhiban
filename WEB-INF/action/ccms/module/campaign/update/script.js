document.getElementById("divEditor").style.display='none';
document.forms["formEditor"].getElementsByTagName("span")[0].innerHTML = "新增Campaign";
document.forms["formEditor"].elements["deleteCommand"].style.display='none';
clearForm("formEditor");
//document.formFilter.alias.focus();
//alert ('El registro fue atualizado en la base de datos.');
search();
