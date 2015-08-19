var actionroot=contextPath+$("#actionroot").val();

function MerchantClass(){
	this.search=null;
	this.cms_id=$("#cms_id").val();
	this.obj=null;
	this.cmsMap=null;
	this.adMap=null;
	this.init=function(){
		var obthis=this;
		obthis.editFun();
		
		//收费方式
		$("#fee_method").on("change",function(){
			if($(this).val()=='1'){
				$("#change_type").html('元/天');
			}else if($(this).val()=='2'){
				$("#change_type").html('元/小时');
			}else if($(this).val()=='3'){
				$("#change_type").html('元/次');
			}
		});
		$("#back_btn").on("click",function(){
			gotoBack();
		});

		$("#allow_btn").unbind();
		$("#allow_btn").on("click",function(){
			$Dialog().confirm("确定通过审核吗?", function(){
				var url=actionroot+"/allow";
				ajaxCall(url,{
					method: "POST",
					progress: true,
					form: "formEditor",
					button: "save_btn",
					dataType: "script",
					success: function(){
						gotoPage($("#actionroot").val()+"/crud");
					}
				});
			});
		});
		$("#noallow_btn").unbind();
		$("#noallow_btn").on("click",function(){
			$Dialog().confirm("确定不通过审核吗?", function(){
				var url=actionroot+"/noallow";
				ajaxCall(url,{
					method: "POST",
					progress: true,
					form: "formEditor",
					button: "save_btn",
					dataType: "script",
					success: function(){
						gotoPage($("#actionroot").val()+"/crud");
					}
				}); 
			});
					
		});
	};

	this.getTemplatel=function(terminal_id,select_id,id,value){
		var url=contextPath+"/action/project/saobao/pub/pick/template?terminal_id="+terminal_id+"&select_id="+select_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		});  
	};
	this.getTerminal_sn=function(area,select_id,id,value){
		var url=contextPath+"/action/project/saobao/pub/pick/terminalSN?area="+area+"&select_id="+select_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		});  
	};
	this.getDomainByNamespace=function(namespace,select_id,id,value){
		var url=contextPath+"/action/ccms/pub/pick/domain/getDomainByNamespace?namespace="+namespace+"&select_id="+select_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		});  
	};

	this.getDomainByBusiness=function(namespace,select_id,id,value){
		var url=contextPath+"/action/ccms/pub/pick/domain/getDomainByNamespace?namespace="+namespace+"&select_id="+select_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		});  
	};
	this.getChildByParent=function(parent_namespace,parent_domain_value,select_id,id,value){
		var url=contextPath+"/action/ccms/pub/pick/domain/getChildDomainByParent?parent_namespace="+parent_namespace+"&select_id="+select_id+"&parent_domain_value="+parent_domain_value;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		}); 
	};
	this.editFun=function(){
		var obthis=this;
		var url=actionroot+"/edit?cms_id="+this.cms_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var province=data["province"];
				province.pop();
				var obj = document.getElementById("province");
				if(obj){
					obj.options.length = 0;
					var option = new Option("","");
					obj.options.add(option);
					for(var key in province){
						option = new Option(province[key].domain_text,province[key].domain_value);
						obj.options.add(option);
					}
				}

				var business=data["business"];
				business.pop();
				var obj = document.getElementById("business_id");
				if(obj){
					obj.options.length = 0;
					var option = new Option("","");
					obj.options.add(option);
					for(var key in business){
						option = new Option(business[key].domain_text,business[key].domain_value);
						obj.options.add(option);
					}
				}
				
				var cms=data["cms"];
				cms.pop();
				obthis.editCms(cms);
				
				/*var location=data["location"];
				location.pop();
				obthis.editlocation(location);*/
				
				var merchant=data["merchant"];
				merchant.pop();
				obthis.editmerchant(merchant);
				
				var time=data["time"];
				time.pop();
				obthis.edittime(time);
			}
		}); 
	};
	this.editCms=function(json){
		var obthis=this;
		if(json.length>0){
			$("#account_id").val(json[0].account_id);
			$("#account_name").val(json[0].account_name);
			$("#custom_time").val(json[0].custom_time);
			$("#fee_method").val(json[0].fee_method);
			switch (json[0].fee_method){
			case '1':
				$("#change_type").html('元/天');
				break;
			case '2':
				$("#change_type").html('元/小时');
				break;
			case '3':
				$("#change_type").html('元/次');
				break;
			}
			$("#fee_num").val(json[0].fee_num);
			obthis.getDomainByNamespace("play_method","play_method","play_method",json[0].play_method);
			$("#play_end_time").val(json[0].play_end_time);
			$("#play_start_time").val(json[0].play_start_time);
			if(json[0].state!='1'){
				$("#allow_btn").hide();
				$("#noallow_btn").hide();
			}else{
				$("#allow_btn").show();
				$("#noallow_btn").show();
			}
		}
	};

	this.getMerchant=function(area,select_id,id,value){
		var url=contextPath+"/action/project/saobao/pub/pick/merchant?area="+area+"&select_id="+select_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "script",
			success: function() {
				if(id!=null && id!=''&& value!=null && value!=''){
					setComboValue(id,value,'formEditor');
				}
			}
		});  
	};
	this.editlocation=function(json){
		var obthis=this;
		if(json.length>0){
			setComboValue("business_id",json[0].business_id,'formEditor');
			setComboValue("province",json[0].province,'formEditor');
			if(json[0].city!=''){
				obthis.getChildByParent("province",json[0].province,"city","city", json[0].city);
				if(json[0].area!=''){
					obthis.getChildByParent("city",json[0].city,"area","area", json[0].area);
					if(json[0].merchant_id!=''){
						obthis.getMerchant(json[0].area, "merchant_id","merchant_id", json[0].merchant_id);
						if(json[0].terminal_id!=''){
							obthis.getTerminal_sn(json[0].merchant_id, "terminal_id","terminal_id", json[0].terminal_id);
							if(json[0].terminal_id!=''){
								obthis.getTemplatel(json[0].terminal_id, "templatel_id","templatel_id", json[0].templatel_id);
							}
						}
					}
				}
			}
		}
	};
	this.editmerchant=function(json){
		var con='';
		for(var key in json){
			setCheckboxValue('ad_list',json[key].ad_id,'formEditor');
			con+='<input type="hidden" value="'+json[key].ad_id+'" name="ad_id" id="ad_id_'+json[key].ad_id+'">';
			con+='<label id="ad_code_'+json[key].ad_id+'" name="ad_code">'+json[key].ad_code+'</label> &nbsp;&nbsp;';
			$("#quanzhong").val(json[key].quanzhong);
			$("#yusuan_jine").val(json[key].yusuan_jine);
		}
		$("#ad_check_list").html(con);
	};
	this.edittime=function(json){
		var cons='';
		for(var key in json){
			setCheckboxValue('time_list',json[key].time_id,'formEditor');
			cons+='<input type="hidden" value="'+json[key].time_id+'" name="time_id" id="time_id_'+json[key].time_id+'">';
			cons+='<label id="time_code_'+json[key].time_id+'" name="time_code">'+json[key].begin_time+'--'+json[key].end_time+'</label> &nbsp;&nbsp;';
		}
		$("#time_check_list").html(cons);
	};
	
}
var merchantClass=null;
$(document).ready(function() {
	merchantClass=new MerchantClass();
	merchantClass.init();
});