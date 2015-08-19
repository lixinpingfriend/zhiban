(function() {
	var $P = function (){
		return new $P.fn.init();
	},
	$P_init = null;
	$P.fn = $P.prototype;
	$P_init = $P.fn.init = function() {
		var searchObj=null;
		var obj = $Crud({
			formId : "formEditor",
			button : "save_btn",
			insertBack : function() {
				searchObj.searchData(1);
			},
			updateBack : function() {
				searchObj.searchData(1);
			},
			deleteBack : function() {
				searchObj.searchData(1);
			},
			addNewBack : function() {
				$("#formTitle").html("新增组织架构层级");
			},
			editBack : function() {
				$("#formTitle").html("修改组织架构层级");
			},
			validate : function() {
				var flag = $("#formEditor").validate({
					rules : {
						name : {
							required : true,
							rangelength: [1,32]
						},
						age: {
							required : true,
							rangelength: [1,2]	
						}
					},
					messages : {
						name : {
							required : "请输入人员姓名",
							rangelength: "层级代码长度为1到32位"
						},
						age: {
							required : "请输入年龄",
							rangelength: "层级名称长度为1到2位"
						}
					}
				});
				return flag;
			},
			check:function(){
				return true;
			}
		}).init();

		this.searchObj=searchObj;
		searchObj=$Search({datagrid : "datagrid",formId : "searchForm",rowpackage : function(obj) {
			if(obj.check_user != null){
				obj.check_user = '<input id="check_user"  name="check_user" type="checkbox" value="'+obj.tuid+'" />&nbsp;'+obj.tuid;
			}
		},success:function(){
			$('input[type=checkbox]').iCheck({
		    		checkboxClass: 'icheckbox_square-blue',
					increaseArea: '20%'
		    });
			$(".edit_btn").on("click",function() {
				if ($(this).attr("code") != undefined && $(this).attr("code") != "") {
				obj.edit({id : $(this).attr("code")});
				}});
			$(".delete_btn").on("click",function() {
				var obthis = $(this);
				$Dialog().confirm("确定要删除吗?",function() {
				if (obthis.attr("code") != undefined && obthis.attr("code") != "") {
					obj.del({id : obthis.attr("code")});}
					});
			});
			$("#selectAll").on("click",function(){
		 		$('input[name=check_user]').iCheck('check');
			});
			$("#unselectAll").on("click",function(){
				$('input[name=check_user]').iCheck('uncheck');
				//reverseselectAll('check_user','view');
			});  
		}}).initSearchBtn(function(){
			$("#save_btn1").on("click",function(){
				var a  = GetCheckboxValue('check_user','view');
				alert(a);
			});
			$("#goto_url").on("click",function(){
				var	url="/action/ccms/module/hr/team/crud";
				gotoPage(url);
			});
		}).searchData(1);
	};
	$P_init.prototype = $P.fn;
	window["szy"]["Test"] = $P;
})();
$(document).ready(function(){
	szy.Test();
});

