var actionroot=contextPath+$("#actionroot").val();

function MerchantClass(){
	this.search=null;
	this.cms_id=$("#cms_id").val();
	this.presetList=null;
	this.obj=null;
	this.cmsMap=null;
	this.adMap=null;
	this.init=function(){
		var obthis=this;
		if(this.cms_id==''&& this.cms_id!=null){
			obthis.getDomainByNamespace("province","province");
			obthis.getDomainByNamespace("business","business_id");
			obthis.getDomainByNamespace("play_method","play_method");
			obthis.getTime();
		}else{
			obthis.editFun();
		}
		$Dialog().date($('#play_start_time'));
		$Dialog().date($('#play_end_time'));
		$Dialog().time($('#start_time'));
		$Dialog().time($('#end_time'));
		$("#save_btn").unbind();
		$("#save_btn").on("click",function(){
			obthis.saveCms();
		});
		$("#pickOpenNotCenter").unbind();
		$("#pickOpenNotCenter").on("click",function(){
			var url = contextPath+"/action/project/saobao/pub/pick/account/crud?id=account_id&name=account_name&pickId=pickOpen";
			$Dialog().open({url:url,id:"pickOpen",width:500,height:400});
		});
		$("#pickClear").unbind();
		$("#pickClear").on("click",function(){
			$("#account_id").val('');
			$("#account_name").val('');
		});
		
		$("#province").unbind("change");
		$("#province").on("change",function(){
			var val=$(this).val();
			if(val==null || val==''){
				$("#city option:not(:first)").remove();
				$("#area option:not(:first)").remove();
				$("#merchant_id option:not(:first)").remove();
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			obthis.getChildByParent("province",val,"city");
			$("#area option:not(:first)").remove();
			$("#area option:not(:first)").remove();
			$("#merchant_id option:not(:first)").remove();
			$("#terminal_id option:not(:first)").remove();
			$("#templatel_id option:not(:first)").remove();
		});
		$("#city").unbind("change");
		$("#city").on("change",function(){
			var province=$("#province").val();
			if(province==""){
				$Dialog().alert("请选择省份.");
				$("#area option:not(:first)").remove();
				$("#merchant_id option:not(:first)").remove();
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			var val=$(this).val();
			if(val==null || val==''){
				$("#area option:not(:first)").remove();
				$("#merchant_id option:not(:first)").remove();
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			obthis.getChildByParent("city",val,"area");
		});
		$("#area").unbind("change");
		$("#area").on("change",function(){
			var city=$("#city").val();
			if(city==""){
				$Dialog().alert("请选择城市.");
				$("#merchant_id option:not(:first)").remove();
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			var val=$(this).val();
			if(val==""){
				$("#merchant_id option:not(:first)").remove();
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			obthis.getMerchant(val,"merchant_id");
		});
		$("#merchant_id").unbind("change");
		$("#merchant_id").on("change",function(){
			var area=$("#area").val();
			if(area==""){
				$Dialog().alert("请选择区域.");
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			var val=$(this).val();
			if(val==""){
				$("#terminal_id option:not(:first)").remove();
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			obthis.getTerminal_sn(val,"terminal_id");
		});

		$("#terminal_id").unbind("change");
		$("#terminal_id").on("change",function(){
			var merchant_id=$("#merchant_id").val();
			if(merchant_id==""){
				$Dialog().alert("请先选择布点商家.");
				$("#template_id option:not(:first)").remove();
				return;
			}
			var val=$(this).val();
			if(val==""){
				$("#templatel_id option:not(:first)").remove();
				return;
			}
			obthis.getTemplatel(val,"templatel_id");
		});
		//选择广告
		$("#checkAd").on("click",function(){
			if($("#adTable").is(":hidden")){
				$("#adTable").modal('show');
			}else{
				$("#adTable").modal('hide');
			}
		});
		//选择档期
		$("#checkTime").on("click",function(){
			if($("#timeTable").is(":hidden")){
				$("#timeTable").modal('show');
			}else{
				$("#timeTable").modal('hide');
			}
		});
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
	};

	this.saveCms=function(){
		if($("#ad_check_list").html().trim()==''){
			setFormErrorMsg("ad_check_list", "值不能为空.");
			return;
		}
		if($("#custom_time").val()=='' || $("#custom_time").val()==null){
			if($("#play_start_time").val()==''||$("#play_start_time").val()==null){
				setFormErrorMsg("play_start_time", "请选择开始时间.");
				return;
			}
			if( $("#play_end_time").val()==''||$("#play_end_time").val()==null){
				setFormErrorMsg("play_end_time", "请选择结束时间.");
				return;
			}
			if( $("#time_check_list").html()==''){
				setFormErrorMsg("time_check_list", "请选择档期.");
				return;
			}
		}
		var url=actionroot;
		if($("#cms_id").val()==''||$("#cms_id").val()==null){
			url+='/insert';
		}else{
			url+='/update';
		}
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
	};
	this.getAd=function(merchant){
		var obthis=this;
		var val=$("#time_id").val();
		var url=actionroot+"/getAd?preset_id="+obthis.presetList[val].preset_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				$("#ad_check_list").html('');
				var json=data["data"];
				json.pop();
				obthis.setAdList(json,merchant);
			}
		});
	};
	this.setAdList=function(json,merchant){
		var obthis=this;
		if(json.length>0){
			var con="";
			for(var key in json){
				con+="<tr>";
				con+="<td> <input type='checkbox' name='ad_list' id='ad_list_"+json[key].ad_id+"' code='"+json[key].ad_code+"' value='"+json[key].ad_id+"' /> </td>";
				con+="<td>"+json[key].ad_code+"</td>";
				con+="<td>"+json[key].ad_remark+"</td>";
				con+="<td>"+json[key].low_price+"</td>";
				con+="<td>"+json[key].low_price+"</td>";
				con+="</tr>";
			}
			$("#adDiv").html(con);
			$("input[type='checkbox'][name='ad_list']").unbind();
			 $("input[type='checkbox'][name='ad_list']").iCheck({
				 	checkboxClass: 'icheckbox_square-blue',
					increaseArea: '20%'
		    });
			 $("input[type='checkbox'][name='ad_list']").on("change",function(){
				var val=$(this).val(); 
				//选中
				if($(this).is(":checked")){
					var con='<input type="hidden" id="ad_id_'+$(this).val()+'" name="ad_id"  value="'+$(this).val()+'" />';
					con+='<label name="ad_code" id="ad_code_'+$(this).val()+'" >'+$(this).attr("code")+'</label> &nbsp;&nbsp;';
					$("#ad_check_list").append(con);
					$("label[for='ad_list']").remove();
				}else{
					$("#ad_id_"+$(this).val()).remove();
					$("#ad_code_"+$(this).val()).remove();
				}
			 });
			 obthis.editmerchant(merchant);
		}else{
			$("#adDiv").html("<tr><td colspan='7'>没有广告位信息</td></tr>");
		}
	};
	this.getTime=function(){
		var obthis=this;
		var url=actionroot+"/getTime";
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				$("#time_check_list").html('');
				var json=data["data"];
				json.pop();
				obthis.setTimeList(json);
			}
		});
	};
	this.setTimeList=function(json,type){
		var obthis=this;
		if(json.length>0){
			var con="";
			obthis.presetList={};
			for(var key in json){
				obthis.presetList[json[key].time_id]=json[key];
				con+="<tr>";
				con+="<td> <input type='radio' name='time_list' id='time_list_"+json[key].time_id+"' value='"+json[key].time_id+"' /> </td>";
				con+="<td>"+json[key].screen_name+"</td>";
				con+="<td>"+json[key].preset_name+"</td>";
				con+="<td>"+json[key].begin_time+"</td>";
				con+="<td>"+json[key].end_time+"</td>";
				con+="</tr>";
			}
			$("#timeDiv").html(con);

			$("input[type='radio'][name='time_list']").unbind();
			 $("input[type='radio'][name='time_list']").iCheck({
			       radioClass: 'iradio_square-blue',
			       increaseArea: '20%'
		    });
			 $("input[type='radio'][name='time_list']").on("click",function(){
				var val=$(this).val();
				//选中
				var con='<input type="hidden" id="time_id" name="time_id"  value="'+val+'" />';
				con+='<label name="time_code" id="time_code" >'+obthis.presetList[val].screen_name+'/'+obthis.presetList[val].preset_name+'&nbsp;&nbsp;&nbsp;'+obthis.presetList[val].begin_time+'--'+obthis.presetList[val].end_time+'</label> &nbsp;&nbsp;';
				$("#time_check_list").html(con);
				if(type==undefined || type==null){
					obthis.getAd();
				}
			 });
			
		}else{
			$("#timeDiv").html("<tr><td colspan='7'>没有广告档期</td></tr>");
		}
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
	this.getTerminal_sn=function(merchant,select_id,id,value){
		var url=contextPath+"/action/project/saobao/pub/pick/terminalSN?merchant_id="+merchant+"&select_id="+select_id;
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
				
				var timelist=data["timelist"];
				timelist.pop();
				obthis.setTimeList(timelist,"edit");
				
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
				
				var time=data["time"];
				time.pop();

				/*var adlist=data["adlist"];
				adlist.pop();*/
				
				obthis.edittime(time,merchant);

				/*
				 * obthis.editmerchant(merchant);
				 * obthis.setAdList(adlist);*/
				
				
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
			if(json[0].state=='3'){
				$("#save_btn").hide();
			}else{
				$("#save_btn").show();
			}
		}
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
	this.edittime=function(json,merchant){
		var obthis=this;
		var cons='';
		obthis.presetList={};
		for(var key in json){
			obthis.presetList[json[key].time_id]=json[key];
			var val=json[key].time_id;
			setCheckboxValue('time_list',val,'formEditor');
			cons+='<input type="hidden" value="'+val+'" name="time_id" id="time_id">';
			cons+='<label id="time_code" name="time_code">'+obthis.presetList[val].screen_name+'/'+obthis.presetList[val].preset_name+'&nbsp;&nbsp;&nbsp;'+json[key].begin_time+'--'+json[key].end_time+'</label> &nbsp;&nbsp;';
		}
		$("#time_check_list").html(cons);
		if(json.length>0){
			obthis.getAd(merchant);
		}
		
	};
	
}
var merchantClass=null;
$(document).ready(function() {
	merchantClass=new MerchantClass();
	merchantClass.init();
});