/**
* 通用的ajax调用
* 参数 url : 服务地址(不加项目名)
* 参数 map (json格式)
		method:提交方式 (GET POST)
		response:加载元素的div ID
		progress:是否开启等待提示(true,false)
		form:提交的表单ID
		button:按钮ID(防止重复提交)
		async:是否异步提交，默认异步(true,false)
		dataType:服务器返回的数据类型 (html,script,json)默认情况如果该值为空，response有值则为html，无则为script
		success:成功回调函数
		error:出错的回调函数
*/



var  $Util = {
		/**
		 * 通用的ajax调用 参数 url : 服务地址(不加项目名) 参数 map (json格式) method:提交方式 (GET POST)
		 * response:加载元素的div ID progress:是否开启等待提示(true,false) form:提交的表单ID
		 * button:按钮ID(防止重复提交) async:是否异步提交，默认异步(true,false) dataType:服务器返回的数据类型
		 * (html,script,json)默认情况如果该值为空，response有值则为html，无则为script
		 * showerror是否显示错误消息 success:成功回调函数 error:出错的回调函数
		 */
		ajaxCall : function(url, map) {
			if (url.indexOf(contextPath) != 0) {
				url = contextPath + url;
			}
			var method = map["method"].toLowerCase(), form = map["form"], btn = map["button"], error = map["error"], callback = map["success"], async = map["async"], response = map["response"], progress = map["progress"], dataType = map["dataType"], data = map["data"], showerror = map["showerror"];
			if (progress == true) {
				ccms.util.loadClass.showLoad();
			}
			if (dataType == null) {
				if (response != null) {
					dataType = "html";
				} else {
					dataType = "script";
				}
			}
			var btnObj = null;
			if (btn != null) {/* 控制按钮不可用 */
				if (btn instanceof Object) {
					btnObj = btn;
				} else {
					btnObj = $("#" + btn);
				}
				btnObj.attr("disabled", true);
			}
			/* var data = null; */
			if (form != null) {
				var formObj = $("#" + form);
				if (formObj.length > 0) {
					data = formObj.serialize();
				} else {
					data = $("form[name='" + form + "']").serialize();
				}
			}
			var access_token = null;
			if (typeof ($.cookie) != 'undefined'
					&& $.cookie('access_token') != "\"\"") {
				access_token = $.cookie('access_token');
			}
			$.ajax({
				type : method,
				beforeSend : function(request) {
					if (access_token) {
						request.setRequestHeader("Authorization", "Bearer "
								+ access_token);
					}
				},
				url : url,
				data : data,
				dataType : dataType,
				async : async == false ? false : true,
				error : function(XMLHttpRequest, txtStatus, errThrow) {
					if (progress == true) {
						ccms.util.loadClass.hideLoad();
					}
					switch (XMLHttpRequest.status) {
					case (500):
						$Dialog().notice("系统错误.", 1500);
						if (error != null) {/* 执行错误回调函数 */
							error();
						}
						break;
					case (400):
						$Dialog().notice("系统错误.", 1500);
						break;
					case (401):
						$Dialog().notice("要访问的服务需要 SSL.", 1500);
						break;
					case (403):
						$Dialog().notice("拒绝访问.", 1500);
						break;
					case (404):
						$Dialog().notice("要访问的服务不存在.", 1500);
						break;
					case (408):
						$Dialog().notice("请求超时.", 1500);
						break;
					default:
						//$Dialog().notice("其他错误.", 1500);
					}
				},
				complete : function(XMLHttpRequest, textStatus) {
					if (progress == true) {
						ccms.util.loadClass.hideLoad();
					}
					if (btnObj) {/* 控制按钮可用 */
						btnObj.removeAttr("disabled");
					}
					var text = XMLHttpRequest.responseText;
					if (text != undefined
							&& text.indexOf("_ajax_VE8374yz_") > 0)/* 跳转到登录界面 */
					{
						window.location = contextPath + "/";
					}
					if (XMLHttpRequest.status == 200) {
						if (callback != null) { /* js代码会被jquery自动执行 */
							if (dataType == "json") {
								var json = null;
								try {
									json = eval("(" + text + ")");
								} catch (e) {
									//$Dialog().notice("JSON格式不合法.", 1500);
								}
								if (json != null) {
									if (json.access_token) {// 是登录
										callback(json);
									} else {
										if (json.resultcode == 0) {
											if (showerror != undefined
													&& showerror == false) {// 是否显示错误消息提示
												callback(json);
											} else {
												var msg = json.message;
												if (msg == undefined
														|| msg == null
														|| msg == '') {
													msg = '操作失败';
												}
												$Dialog().notice(msg, 1500);
											}
										} else {
											callback(json, url);
										}
									}
								}
							} else {
								callback(text);
							}
						}
					} else {/* 查询时出现验证错误 */
						if (dataType == "json") {
							try {
								eval(text);
							} catch (e) {
								if (text.indexOf("invalid_token") > 0)/* 跳转到登录界面 */
								{
									window.location = contextPath + "/";
								} else {
									$Dialog().notice("语法错误.", 1500);
								}
							}
						}
					}
				}
			});
		},
		/* 清除错误提示信息 */
		clearErrorMessages : function() {
			$("label.error").each(function() {
				$(this).remove();
			});
			$(".form-control.error").each(function() {
				$(this).removeClass("error");
			});
		},
		/* 按照既定清除规则清理表单 */
		clearForm : function(formId) {
			var f = $("#" + formId);
			if (f.length == 0) {
				f = document.forms[formId];
			} else {
				f = f[0];
			}

			for (var i = 0; i < f.elements.length; i++) {
				var e = f.elements[i];
				if (e.type == "text" || e.type == "hidden"
						|| e.tagName == "TEXTAREA" || e.type == "password") {
					if (e.getAttribute("preserve") != "true")
						e.value = "";
				}
				if (e.tagName == "SELECT") {
					if (e.getAttribute("preserve") != "true")
						e.options.selectedIndex = 0;
				}
				if (e.type == "checkbox") {
					if (e.getAttribute("default") == "checked") {
						e.checked = true;
					} else {
						if (e.getAttribute("preserve") != "true") {
							$(e).iCheck("uncheck");
						}
					}
				}
				if (e.type == "radio") {
					if (e.getAttribute("default") == "checked") {
						e.checked = true;
					} else {
						if (e.getAttribute("preserve") != "true") {
							$(e).iCheck("uncheck");
						}
					}
				}
			}
			ccms.util.clearErrorMessages();
		},
		/* 错误信息展示 */
		setFormErrorMsg : function(formElementId, text) {
			ccms.util.clearErrorMessages();
			var obj = $("#" + formElementId);
			if (obj.length > 0) {
				if (obj.attr("type") == "radio"
						|| obj.attr("type") == "checkbox") {/* iCheck样式需特殊处理 */
					obj.parent().parent().append(
							$("<label/>").addClass("error").attr("for",
									formElementId).html(text));
				} else {
					obj.after($("<label/>").addClass("error").attr("for",
							formElementId).html(text));
				}
			}
		},
		/* json object to url */
		jsonToUrl : function(map) {
			var str = "";
			for (id in map) {
				str += "&" + id + "=" + map[id];
			}
			if (str.length > 0) {
				str = str.substring(1, str.length);
			}
			return str;
		},
		/* 页面返回 */
		gotoBack : function() {
			window.history.back();
		},
		/* 页面跳转公共方法 */
		gotoPage : function(url) {
			window.location = '#' + url;
		},
		href : function(url) {
			window.location = contextPath+ url;
		},
		decimal2 : function(nm, n) {
			var ts = "1";
			var tn = 1;
			for (var i = 0; i < n; i++) {
				ts += "0";
			}
			tn = parseInt(ts);
			var num = Math.round(nm * tn) / tn;
			var numstr = num + "";
			var dotindex = numstr.indexOf(".");
			var newstr = '';
			if (dotindex > 0) {
				newstr = numstr.substring(dotindex, numstr.length);
				if (newstr > 2) {
					numstr = numstr.substring(0, numstr.length - 2);
					num = parseFloat(numstr);
				}
			}
			return num;
		},
		getAge : function(birthday) {/* 得到年龄 */
			if (birthday == null) {
				return '&nbsp;';
			}
			var now = new Date();
			var byear = birthday.substring(0, 4);
			var age = now.getFullYear() - parseInt(byear);
			if (age <= 0) {
				return '&nbsp;';
			}
			return age;
		},
		getImageSize : function(sizestr) {
			var size = parseInt(sizestr);
			return (size / 1024).toFixed(2) + 'KB';
		},
		getImageUrl : function(id) {/* 得到图片url */
			return contextPath + "/image/" + id;
		},
		getVideoUrl : function(id) {/* 得到图片url */
			return contextPath + "/video/" + id;
		},
		getResource : function(id) {/* 得到资源图片url */
			id = id.replace(/\\/g, "-");
			var imageUrl = contextPath + "/resource/image/" + id;
			var videoUrl = contextPath + "/resource/video/" + id;
			var audioUrl = contextPath + "/resource/audio/" + id;
			return {
				'image' : imageUrl,
				'video' : videoUrl,
				'audio' : audioUrl
			};
		},
		getCurrentDateTime : function() {/* 得到当前时间 */
			var date = new Date();
			return date.format("yyyy-MM-dd hh:mm:ss");
		},
		toDate : function(objDate) {
			var date = new Date(Date.parse(objDate.replace(/-/g, "/")));
			return date;
		},
		absPos : function(node) {
			var x = y = 0;
			do {
				x += node.offsetLeft;
				y += node.offsetTop;
			} while (node = node.offsetParent);
			return {
				'x' : x,
				'y' : y
			};
		},
		postData : function(url, map) {
			if(map.method=='undefined'){
				map.method = 'get';
			}
			map.dataType = "json";
			$Util.ajaxCall(url, map);
		},
		setFormData : function(formName, dataMap) {/* 给表单赋值 */
			if (formName == null) {
				return;
			}
			if (dataMap == undefined) {
				return;
			}
			var f = document.forms[formName];
			if (f == undefined) {
				return;
			}
			var fLength = f.elements.length;
			for (var i = 0; i < fLength; i++) {
				var e = f.elements[i];
				var n = e.name;
				if (n == undefined || n == "") {
					continue;
				}
				var v = dataMap[n];
				if (v == undefined || (v == '' && v != 0)) {
					continue;
				}
				if (e.type == "text" || e.type == "hidden"
						|| e.tagName == "TEXTAREA" || e.type == "password") {
					e.value = v;
				} else if (e.tagName == "SELECT") {
					ccms.util.setComboValue(n, v, formName);
				} else if (e.type == "checkbox") {
					if (e.value == v) {
						$(e).iCheck("check");
					}
				} else if (e.type == "radio") {
					if (e.value == v) {
						$(e).iCheck("check");
					}
				}
			}
		},
		loadClass : {
			state : "",
			hideLoad : function() {
				$("#loading").hide();
				$(document.body).css("overflow", ccms.util.loadClass.state);
			},
			showLoad : function() {
				ccms.util.loadClass.state = $(document.body).css("overflow");
				var loadObj = $("#loading");
				$(document.body).css("overflow", "hidden");
				if (loadObj.length == 0) {
					var loaddiv = '<div id="loading" class="loading"><div class="loading-wait">';
					loaddiv += '<svg viewBox="0 0 150 150">';
					loaddiv += '<g>';
					loaddiv += '<circle r="10" cy="16.6987298" cx="35" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " id="12"/>';
					loaddiv += '<circle r="10" cy="35" cx="16.6987298" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " id="11"/>';
					loaddiv += '<circle r="10" cy="60" cx="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " id="10"/>';
					loaddiv += ' <circle r="10" cy="85" cx="16.6987298" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " id="9"/>';
					loaddiv += '<circle r="10" cy="103.30127" cx="35" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " id="8"/>';
					loaddiv += '<circle r="10" cy="110" cx="60" id="7"/>';
					loaddiv += '<circle r="10" cy="103.30127" cx="85" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " id="6"/>';
					loaddiv += '<circle r="10" cy="85" cx="103.30127" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " id="5"/>';
					loaddiv += '<circle r="10" cy="60" cx="110" transform="translate(110, 60) rotate(-90) translate(-110, -60) " id="4"/>';
					loaddiv += '<circle r="10" cy="35" cx="103.30127" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " id="3"/>';
					loaddiv += '<circle r="10" cy="16.6987298" cx="85" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " id="2"/>';
					loaddiv += '<circle r="10" cy="10" cx="60" id="1"/>';
					loaddiv += '</g>';
					loaddiv += '</svg>';
					loaddiv += '</div></div>';
					$(document.body).append(loaddiv);
				} else {
					loadObj.show();
				}
			}
		},
		ajaxLoad : function(obj, url, callback) {
			ccms.util.loadClass.showLoad();
			obj.load(url, function(response, status, xhr) {
				ccms.util.loadClass.hideLoad();
				switch (status) {
				case ("error"):
					$Dialog().notice("系统错误.", 1500, function() {
						/* $Util.gotoBack(); */
					});
					break;
				case ("timeout"):
					$Dialog().notice("访问超时,稍候请刷新重试.", 1500);
					break;
				case ("parsererror"):
					$Dialog().notice("格式转换错误.", 1500);
					break;
				case ("notmodified"):
					break;
				default:
					if (response.indexOf("_ajax_VE8374yz_") > 0)// 跳转到登录界面
					{
						window.location = contextPath+"/";
					}
					if (callback != undefined) {
						callback(response);
					}
				}
				;
			});
		},
		loadDivPage : function(id, url, callback) {
			if (url == undefined || url == "")
				return;
			var hash = url;// = flag?url:$Base64.encode(url);
			var tabObj = $("#menuTab a[href=\"#" + hash + "\"]");
			if (tabObj.length > 0) {
				$("#menuTab").find(".active").removeClass("active");
				tabObj.parent().addClass("active");
			}
			ccms.util.ajaxLoad($("#" + id), contextPath + url, function() {
				if(typeof(callback)=='function'){
					callback();
				}
				/**
				 * 页面初始化时给必填字段初始化
				 */
				$("#" + id + " label.required").each(function() {
					if ($(this).find(".red").length == 0) {
						$(this).append("<span class='red'>*</span>");
					}
				});
				// radio样式
				$('#' + id + ' input[type=radio]').iCheck({
					radioClass : 'iradio_square-blue',
					increaseArea : '20%'
				});
				// checkbox样式
				$('#' + id + ' input[type=checkbox]').iCheck({
					checkboxClass : 'icheckbox_square-blue',
					increaseArea : '20%'
				});
			});
		},
		/* 渲染radio or checkbox */
		renderRadio : function(name) {
			$("input[name=" + name + "]").iCheck({
				radioClass : 'iradio_square-green',
				increaseArea : '30%'
			});
		},
		renderCheckbox : function(name) {
			$("input[name=" + name + "]").iCheck({
				checkboxClass : 'icheckbox_square-green',
				increaseArea : '20%'
			});
		},
		refreshMenu : function(url) {// 刷新选中菜单
			if (url) {
				var tabObj = $("#menuTab a[href=\"#" + url + "\"]");
				$("#menuTab").find(".active").removeClass("active");
				tabObj.parent().addClass("active");
			}
		},
		getUrlVars : function() {
			var vars = [], hash;
			var hashes = window.location.href.slice(
					window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},
		getUrlVar : function(name) {
			return $Util.getUrlVars()[name];
		},
		/**
		 * radio checkbox 赋值
		 */

		setCheckboxValue : function(radioName, radioValue, formName) {
			$("form[name='" + formName + "'] input[name='" + radioName + "']")
					.each(function() {
						if ($(this).val() == radioValue) {
							$(this).iCheck("check");
						}
					});
		},

		/**
		 * 下拉框赋值
		 */
		setComboValue : function(comboName, comboValue, formName) {
			if (formName == "") {
				return;
			}
			var combo = document.forms[formName].elements[comboName];
			var cantidad = combo.length;
			for (var i = 0; i < cantidad; i++) {
				if (combo[i].value == comboValue) {
					combo[i].selected = true;
				}
			}
		},
		// 获取radiobutton值
		getRadioValue : function(val, formObj) {
			var obj;
			obj = document.forms[formObj].elements[val];
			if (obj != null) {
				if (typeof (obj.length) == "undefined") {
					return obj.value;
				}
				var i;
				for (i = 0; i < obj.length; i++) {
					if (obj[i].checked) {
						return obj[i].value;
					}
				}
			}
			return '';
		},
		// 获取checkbox值，逗号拼接
		getCheckboxValue : function(val, formObj) {
			var obj;
			obj = document.forms[formObj].elements[val];
			if (obj != null) {
				var str = "";
				var i;
				if (obj.length) {
					for (i = 0; i < obj.length; i++) {
						if (obj[i].checked) {
							str += obj[i].value + ",";
						}
					}
					if (str.length > 0) {
						str = str.substring(0, str.length - 1);
					}
				} else {
					if (obj.checked) {
						str = obj.value;
					}
				}
				return str;
			}
			return '';
		},
		// 选择多个checkbox值,在界面生成中使用
		selectMultiCheckboxValue : function(ic, fc, fm) {
			var str = "";
			$("form[name='" + fm + "'] input[name='" + ic + "']").each(
					function() {
						if ($(this)[0].checked == true) {
							str += $(this).val() + ",";
						}
					});
			if (str.endWith(",")) {
				str = str.substring(0, str.length - 1);
			}
			$("form[name='" + fm + "'] input[name='" + fc + "']").val(str);
		},
		setMulitCheckboxValue : function(fc, fc_value, fm) {
			var s = (fc_value + "").split(",");
			for (var b = 0; b < s.length; b++) {
				if (s[b] != null && s[b] != "")
					ccms.util.setCheckboxValue(fc, s[b], fm);
			}
		},
		selectAll : function(id, formName) {
			$("form[name='" + formName + "'] input[name='" + id + "']").each(
					function() {
						$(this).iCheck("check");
					});
		},
		unselectAll : function(id, formName) {
			$("form[name='" + formName + "'] input[name='" + id + "']").each(
					function() {
						$(this).iCheck("uncheck");
					});
		},
		reverseselectAll : function(id, formName) {
			$("form[name='" + formName + "'] input[name='" + id + "']").each(
					function() {
						if ($(this)[0].checked == true) {
							$(this).iCheck("uncheck");
						} else {
							$(this).iCheck("check");
						}
					});
		},
		followselectAll : function(id, formName, flag) {
			if (flag == true) {
				ccms.util.selectAll(id, formName);
			} else {
				ccms.util.unselectAll(id, formName);
			}
		},addClickEvent:function(obj,callback){
			isMobile=$Util.Mobile.any();/*判断是否是移动设备*/
			if(isMobile){
				obj.unbind().on("touchstart",callback);
			}else{
				obj.unbind().on("click",callback);
			}
		},Mobile:{
		    Android: function() {
		        return navigator.userAgent.match(/Android/i) ? true : false;
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) ? true : false;
		    },
		    any: function() {
		        return ($Util.Mobile.Android() || $Util.Mobile.BlackBerry() || $Util.Mobile.iOS() || $Util.Mobile.Windows());
		    }
		},toObjString:function(obj){
			if(typeof(obj)=='string'){
				return obj;
			}
			return JSON.stringify(obj);
		},strToObj:function(obj){
			if(typeof(obj)=='string'){
				return eval("(" + obj + ")");
			}
			return obj;
		},initTableSelect:function(datagrid){//初使化表格选 中样式
			if(datagrid==undefined){
				datagrid='datagrid';
			}
			$("#"+datagrid).unbind().click(function(e){
				var target=$(e.target);
				$("#"+datagrid).find("tr").removeClass("select");
				target.parent().addClass("select");
			});
		},getDutyUser:function(callback,planDate){//获取正在值班用户
			var url='/action/project/dutyplan/searchOne';
			if(planDate!=undefined && planDate!='undefined'){
				 url='/action/project/dutyplan/searchOne2';
			}
			$Util.postData(url,{method:"post",data:"planDate="+planDate,dataType:"json",success:function(data){
				var array=data.result;//tuid,user_id,plan_date,user_name
				array.pop();
				if(array.length>0){
					var obj=array[0];
					if(callback!=undefined){
						callback(obj);
					}
				}else{
					$Dialog().notice("没有排班计划，请先排班",1500,function(){
						$Dialog().close();
					});
				}
			}});
		},getDomain:function(namespace,callback){//获取正在值班用户
			var url='/action/project/domain/search?namespace='+namespace;
			postData(url,{dataType:"json",success:function(data){
				var array=data.rows;//tuid,user_id,plan_date,user_name
				array.pop();
				if(array.length>0){
					callback(array);
				}
			}});
		},insertDutyRecord:function(paramMap,callback){//添加值班记录
			paramMap.repair_id=paramMap.repair_id==null?"":paramMap.repair_id;
			paramMap.relation_record_id=paramMap.relation_record_id==null?"":paramMap.relation_record_id;
			paramMap.event_type=paramMap.event_type==null?1:paramMap.event_type;
			if(paramMap.event_type!=1){
				paramMap.entity_id=paramMap.entity_id==null?1:paramMap.entity_id;
			}
			$Util.getDutyUser(function(data){
				paramMap.plan_id=data.tuid;
				paramMap.duty_id=data.user_id;
				
				var url='/action/project/dutyrecord/add/insert';
				var pars='event_type='+paramMap.event_type+'&plan_id='+paramMap.plan_id+'&duty_id='+paramMap.duty_id;
				pars=pars+'&remark='+paramMap.remark;
				pars=pars+'&repair_id='+paramMap.repair_id;
				pars=pars+'&relation_record_id='+paramMap.relation_record_id;
				pars=pars+'&entity_id='+paramMap.entity_id;
				$Util.postData(url,{method:"post",dataType:"json",data:pars,success:function(data){
					if(callback!=undefined){
						callback();
					}
				}});
			});
		},getIframeObj:function(photoframeframe){//frameobj对象
			var obj=$(window.parent.document).contents().find("#"+photoframeframe);
			if(obj==undefined || obj.length==0){
				return parent;
			}
			return $(window.parent.document).contents().find("#"+photoframeframe)[0].contentWindow;
		}
}

function ajaxCall(url, map)
{
		if (url.indexOf(contextPath) != 0) {
			url = contextPath + url;
		}
		var method = map["method"].toLowerCase();
		var form = map["form"];
		var data = map["data"];
		var btn = map["button"];
		var error = map["error"];
		var callback = map["success"];
		var async = map["async"];
		var response = map["response"];
		var progress = map["progress"];
		var dataType = map["dataType"];
		if(dataType == null){
			if(response != null){
				dataType = "html";
			}else{
				dataType = "script";
			}
		}

		if(btn != null){//控制按钮不可用
			$("#"+btn).attr("disabled", true);
		}
		if(progress == true){//控制等待提示
			LoadClass.showLoad();
		}
		
		//var data = null;
		if (form != null){
			var formObj = $("#"+form);
			if(formObj.length > 0){
				//data = formObj.serialize();
				data = getFormValues(form);
			}else{
				data = $("form[name='"+form+"']").serialize();
			}
		}else if(method == "post"){	/*如果POST方法没指定form,则重构url及data数据*/
			data = url.substring(url.indexOf("?")+1,url.length);
			url = url.substring(0,url.indexOf("?"));
		}
		$.ajax({
			type : method,
			url : url,
			data : data,
			dataType : dataType,
			async: async==false?false:true,
			error: function(XMLHttpRequest,txtStatus,errThrow) {
				switch (XMLHttpRequest.status){  
					case(500):
						$Dialog().notice("系统错误.",1500);
						if (error != null){//执行错误回调函数
							error();
						}
						break;  
					case(400):  
						$Dialog().notice("系统错误.",1500);
						break;  
					case(401):  
						$Dialog().notice("要访问的服务需要 SSL.",1500);
						break;  
					case(403):  
						$Dialog().notice("拒绝访问.",1500);
						break;  
					case(404):  
						$Dialog().notice("要访问的服务不存在.",1500);
						break; 
					case(408):  
						$Dialog().notice("请求超时.",1500);
						break;  
					default:  
						if(errThrow.toString().indexOf("JSON.parse") < 0){
							//$Dialog().alert("其他错误."+errThrow);
						}
				};
			},
			complete : function(XMLHttpRequest, textStatus) {
				if(btn != null){//控制按钮可用
					$("#"+btn).removeAttr("disabled");
				}
				if(progress == true){//控制等待提示消失
					LoadClass.hideLoad();
				}
				var contentType = XMLHttpRequest.getResponseHeader("Content-type");
				var text = XMLHttpRequest.responseText;
				if (text!=undefined && text.indexOf("_ajax_VE8374yz_")>0)//跳转到登录界面
				{
					window.location = contextPath + "/" + window.location.hash;
				}
				if(XMLHttpRequest.status == 200){
					if(contentType.indexOf("text/validate") < 0){//验证失败的自定义错误
						if(contentType.indexOf("text/javascript") < 0) //js代码会被jquery自动执行
						{
							if(response != null){
								$("#"+response).html(text);
							}
						}
						if (callback != null){
							if(dataType == "json"){
								var json = null;
								try{
									json = eval("(" + text + ")");
								}catch(e){
									//$Dialog().notice("JSON格式不合法.",1500);
								}
								if(json != null) callback(json);
							}else{
								callback();
							}
						}
					}else{//查询时出现验证错误
						if(dataType == "json"){
							try{
								eval(text);
							}catch(e){
								$Dialog().notice("语法错误.",1500);
							}
						}
					}
					
				}
			}
		});
}

function  postData(url, map){
	map.method="get";
	map.dataType = "json";
	ajaxCall(url, map);
}

/*
*加载页面
*/
function ajaxLoad(obj, url, callback){
	LoadClass.showLoad();
	obj.load(url, function(response,status,xhr){
		LoadClass.hideLoad();
		switch (status){  
			case("error"):  
				$Dialog().notice("系统错误.",1500,function(){
					gotoBack();
				});
				break;  
			case("timeout"):
				$Dialog().notice("访问超时,稍候请刷新重试.",1500);
				break;  
			case("parsererror"):
				$Dialog().notice("格式转换错误.",1500);
				break;
			case("notmodified"):
				break;
			default:  
				if (response.indexOf("_ajax_VE8374yz_")>0)//跳转到登录界面
				{
					window.location = contextPath+"/"+ window.location.hash;
				}
				if(callback != undefined){
					callback(response);
				}
		};
	});
}

/*
* 按照既定清除规则清理表单
*/
function clearForm(formId)
{
	var f = $("#"+formId);
	if(f.length == 0){
		f = document.forms[formId];
	}else{
		f = f[0];
	}
	for (var i=0;i<f.elements.length;i++)
	{
		var e = f.elements[i];
		if (e.type=="text" || e.type=="hidden" || e.tagName=="TEXTAREA" || e.type=="password")
		{
		    if(e.getAttribute("preserve")!="true")
    			e.value = "";
		}
		if (e.tagName=="SELECT")
		{
			if(e.getAttribute("preserve")!="true")
			    e.options.selectedIndex = 0;
		}
		if (e.type=="checkbox")
		{
		    if(e.getAttribute("default")=="checked"){
		    	e.checked = true;
    		}else{
    		    if(e.getAttribute("preserve")!="true"){
					$(e).iCheck("uncheck");
				}
			}
    	}
		if (e.type=="radio")
		{
		    if(e.getAttribute("default")=="checked"){
		    	e.checked = true;
    		}else{
    		    if(e.getAttribute("preserve")!="true"){
					$(e).iCheck("uncheck");
				}
			}
    	}
	}
	clearErrorMessages();
}

/*
	清除错误提示信息
*/
function clearErrorMessages() {
	$("label.error").each(function(){
		$(this).remove();
	});
	$(".form-control.error").each(function(){
		$(this).removeClass("error");
	});
}

/*
	错误信息展示
	/action/ccms/validate
*/
function setFormErrorMsg(formElementId,text) {
	clearErrorMessages();
	var obj = $("#"+formElementId);
	if(obj.length > 0){
		if(obj.attr("type")=="radio" || obj.attr("type")=="checkbox"){//iCheck样式需特殊处理
			obj.parent().parent().append($("<label/>").addClass("error").attr("for",formElementId).html(text));
		}else{
			obj.after($("<label/>").addClass("error").attr("for",formElementId).html(text));
		}
	}
}
/**
* 等待状态控制
*/
function LoadClass(){}
LoadClass.state=null;
LoadClass.showLoad=function(){
	LoadClass.state=$(document.body).css("overflow");
	$(document.body).css("overflow","hidden");
	if (document.getElementById('loading') == null) {
		var loaddiv = '<div id="loading"><div id="loading-child">';
		loaddiv+='<svg viewBox="0 0 150 150">';
		loaddiv+='<g id="circle" class="g-circles g-circles--v1">';
		loaddiv+='<circle r="10" cy="16.6987298" cx="35" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " id="12"/>';
		loaddiv+='<circle r="10" cy="35" cx="16.6987298" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " id="11"/>';
		loaddiv+='<circle r="10" cy="60" cx="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " id="10"/>';
		loaddiv+=' <circle r="10" cy="85" cx="16.6987298" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " id="9"/>';
		loaddiv+='<circle r="10" cy="103.30127" cx="35" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " id="8"/>';
		loaddiv+='<circle r="10" cy="110" cx="60" id="7"/>';
		loaddiv+='<circle r="10" cy="103.30127" cx="85" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " id="6"/>';
		loaddiv+='<circle r="10" cy="85" cx="103.30127" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " id="5"/>';
		loaddiv+='<circle r="10" cy="60" cx="110" transform="translate(110, 60) rotate(-90) translate(-110, -60) " id="4"/>';
		loaddiv+='<circle r="10" cy="35" cx="103.30127" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " id="3"/>';
		loaddiv+='<circle r="10" cy="16.6987298" cx="85" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " id="2"/>';
		loaddiv+='<circle r="10" cy="10" cx="60" id="1"/>';
		loaddiv+='</g>';
		loaddiv+='</svg>';
		loaddiv+='</div></div>';
		$(document.body).append(loaddiv);
	} else {
		$('#loading').show();
	}
};
LoadClass.hideLoad=function(){
	$('#loading').hide();
	$(document.body).css("overflow",LoadClass.state);
};

/**
* JSON对象转换成url拼接参数
*/
function jsonToUrl(map) {
	var str = "";
	$.each(map, function(id, value){
		str += "&"+id+"="+value;
	});
	if(str.length > 0){
		str = str.substring(1, str.length);
	}
	return str;
}
/*
* 页面跳转公共方法，当加载到首界面时会被hashchange替换
*/
function gotoPage(url){
	if($("#body_content").length > 0){//存在首页
		if(url==undefined || url=="") return;
		var hash = $Base64.encode(url);
		window.location.hash = "#"+hash;
	}else{
		window.location = contextPath+url;
	}
}
/*
* 页面返回
*/
function gotoBack(){
	window.history.back();
}
/**
* 创建标准的crud操作
	自动调用的全局函数
	参数map 为一些参数和后处理函数
	formId 对应表单ID
	button 对应提交按钮
	resetButton 对应重置按钮
	addNewButton 对应新增按钮
	actionroot 对应操作目录，默认当前目录
	modalId 对应表单弹出框ID，默认modalAddnew
	isUseModal 是否使用弹出框，对于界面只有表单的情况使用，默认true
	bpkField 对应主键字段，默认 tuid
	validate 对应jquery validate 可以简单判断的验证情况
	check 对应验证函数（逻辑比较复杂的情况）
	addNewBack 对应新增界面出来后函数
	editBack 对应编辑后函数
	insertBack 对应新增后函数
	updateBack 对应修改后函数
	deleteBack 对应删除后函数
*/
function SystemOperator(map) {
	this.formId = map.formId;
	if(this.formId == null || this.formId == undefined || $("#"+this.formId).length == 0){
		alert("The parameter 'formId' is not available, please check your configuration !");
	}
	this.map = map;
	this.actionroot = map.actionroot!=null?map.actionroot:$("#actionroot").val();
	this.modalId = map.modalId!=null?map.modalId:"modalAddnew";
	this.isUseModal = map.isUseModal!=null?map.isUseModal:"true";
	this.button = map.button!=null?map.button:"save_btn";
	this.resetButton = map.resetButton!=null?map.resetButton:"reset_btn";
	this.addNewButton = map.addNewButton!=null?map.addNewButton:"addnew_btn";
	this.bpkField = map.bpkField!=null?map.bpkField:"tuid";
	this.bpkObj = $("#"+this.formId+" input[name='"+this.bpkField+"']");
	this.cascade = null;
	
	this.initValidate = function() {// 初使化验证
		var obthis = this;
		$.validator.setDefaults({
			submitHandler : function(form) {
				if(obthis.map["check"] != null) {
					if (!obthis.map["check"]()) {
						return false;
					}
				}
				if(obthis.bpkObj.length > 0){
					if(obthis.bpkObj.val() == ""){
						obthis.insert();
					}else{
						obthis.update();
					}
				}
			},
			errorPlacement : function(error,obj) {
				if(obj.attr("type")=="radio" || obj.attr("type")=="checkbox"){//iCheck样式需特殊处理
					obj.parent().parent().append(error);
				}else{
					obj.after(error);
				}
			}
		});
		//验证函数需要初始化
		if(this.map["validate"] != null) {
			this.map["validate"]();
		}
	},
	//初始化按钮事件
	this.init = function(callback) {
		
		this.initValidate();

		var obthis = this;
		$("#"+this.addNewButton).unbind().on("click", function(e){
			obthis.addNew();
			e.preventDefault();
		});
		$("#"+this.button).unbind().click(function() {
			if(obthis.map["validate"] != null) {
				if (!obthis.map["validate"]()) {
					return false;
				}
			}
			$("#"+obthis.formId).submit();
		});
		$("#"+this.resetButton).unbind().on("click", function(e) {
			clearForm(obthis.formId);
			e.preventDefault();
		});

		if(callback != undefined){
			callback();
		}
		
		return this;
	}, this.addNew = function() {
		//主键去除不能清空属性
		if(this.bpkObj.length > 0){
			this.bpkObj.removeAttr("preserve");
		}
		clearForm(this.formId);
		if(this.isUseModal == "true"){
			$("#"+this.modalId).modal("show");
		}
		if(this.map["addNewBack"] != null) {
			this.map["addNewBack"]();
		}
	}, this.edit = function(maps) {
		clearForm(this.formId);
		var url = this.actionroot + "/edit?" + jsonToUrl(maps);
		var obthis = this;
		ajaxCall(url,{
				method: "post",
				progress: true,
				dataType: "script",
				success: function() {
					//主键增加不能清空属性
					if(obthis.bpkObj.length > 0){
						obthis.bpkObj.attr("preserve","true");
					}
					if(obthis.isUseModal == "true"){
						$("#"+obthis.modalId).modal("show");
					}
					if(obthis.map["editBack"] != null) {
						obthis.map["editBack"]();
					}
				}
		});
	}, this.insert = function() {
		var url = this.actionroot + "/insert";
		var obthis = this;
		ajaxCall(url,{
				method: "post",
				progress: true,
				form: this.formId,
				button: this.button,
				dataType: "script",
				success: function() {
					if(obthis.isUseModal == "true"){
						$("#"+obthis.modalId).modal("hide");
					}
					if(obthis.map["insertBack"] != null) {
						obthis.map["insertBack"]();
					}
				}
		});
	}, this.update = function() {
		var url = this.actionroot + "/update";
		var obthis = this;
		ajaxCall(url,{
				method: "post",
				progress: true,
				form: this.formId,
				button: this.button,
				dataType: "script",
				success: function() {
					if(obthis.isUseModal == "true"){
						$("#"+obthis.modalId).modal("hide");
					}
					if(obthis.map["updateBack"] != null) {
						obthis.map["updateBack"]();
					}
				}
		});
	}, this.del = function(maps) {
		var url = this.actionroot + "/delete?" + jsonToUrl(maps);
		var obthis = this;
		ajaxCall(url,{
				method: "post",
				progress: true,
				dataType: "script",
				success: function() {
					if(obthis.map["deleteBack"] != null) {
						obthis.map["deleteBack"]();
					}
				}
		});
	};
}
/**
* 通用的分页查询类
	参数map 为一些参数和后处理函数
	formId 对应表单ID
	actionroot 对应操作目录，默认当前目录
	button 查询按钮
	resetButton 清空按钮
	success 成功查询后回调函数
	rowpackage 单条数据的遍历处理
*/
//全局的回调函数
function SystemSearchTool(map) {
	this.datagrid = map.datagrid;
	this.formId = map.formId;
	if(this.formId == null || this.formId == undefined || $("#"+this.formId).length == 0){
		alert("The parameter 'formId' is not available, please check your configuration !");
	}
	this.formObj = $("#"+map.formId);
	this.actionroot = map.actionroot!=null?map.actionroot:$("#actionroot").val();
	this.button = map.button!=null?map.button:"search_btn";
	this.resetButton = map.resetButton!=null?map.resetButton:"search_reset_btn";

	this.initSearchBtn = function(callback) {
		var operthis = this;
		$("#"+this.button).on("click", function(e) {// 搜索按钮
			operthis.searchData();
			e.preventDefault();
		});

		$("#"+this.resetButton).on("click", function(e) {
			clearForm(operthis.formId);
			e.preventDefault();
		});

		$('#'+this.formId).on("keypress", function(e) {// 搜索按钮的search框
			e = e || event;
			if (e.keyCode == 13) {
				operthis.searchData();
				return false;
			}
		});
		
		//给可排序字段添加事件
		this.formObj.next().find(".sortable").on("click", function(){
			var code = $(this).attr("code");
			if(code != undefined && code != ""){
				var caret = $(this).find(".caret");
				operthis.formObj.next().find(".caret,.caret-top").each(function(){$(this).remove();});
				if(caret.length > 0){//倒序
					operthis.formObj.find("input[name='order']").val("desc");
					$(this).append('<span class="caret-top"></span>');
				}else{//顺序
					operthis.formObj.find("input[name='order']").val("asc");
					$(this).append('<span class="caret"></span>');
				}
				operthis.formObj.find("input[name='sort']").val(code);
				operthis.searchData(1);
			}
		});

		if(callback != undefined){
			callback();
		}
		return this;
	}, this.searchData = function(pNo) {
		if(this.formObj.length==0 || $("#"+this.datagrid).length==0){//没有不执行
			return ;
		}
		if (pNo == undefined) {
			pNo = 1;
		}
		if(typeof(this.formObj[0].pageNo) != "undefined"){
			this.formObj[0].pageNo.value = pNo;
		}
		$('#' + this.datagrid + 'Template').hide();//隐藏模版
		this.searchDataJson();
		return this;
	}, this.searchDataJson = function() {
		var url = this.formObj.attr('action');
		if (url == "" || url == undefined) {
			url = this.actionroot + "/search";
		}
		var obthis = this;
		ajaxCall(url,{
				method: "post",
				progress: true,
				form: this.formId,
				button: this.button,
				dataType: "json",
				success: function(data) {
					obthis._generalTable(data);
				}
		});
	}, this._generalTable = function(data) {
		var list = data.rows;
		//删除最后拼接的空对象
		list.pop();
		var page = data.page;
		if(this.formObj[0].totalPages!=undefined && page!=undefined){//写入总页数
			this.formObj[0].totalPages.value = page.totalPages;
		}
		if(this.formObj[0].total!=undefined && page!=undefined){//写入总条数
			this.formObj[0].total.value = page.total;
		}
		$("#" + this.datagrid).empty();
		for (var i = 0; i < list.length; i++) {
			var obj = list[i];
			obj.index=(i+1);
			if(map['rowpackage'] != undefined){//单条数据处理操作
				map['rowpackage'](obj);
			}
			var html = this._generalHtml(obj);
			$("#" + this.datagrid).append(html);
		}
		if (list.length == 0) {
			var thCount = $("#" + this.datagrid).parent().find("th").length;
			if(thCount > 0){
				$("#" + this.datagrid).append("<td colspan='"+thCount+"' class='no-data'>没有记录</td>");
			}else{
				$("#" + this.datagrid).append("<div class='no-data'>没有记录</div>");
			}
		}
		if(map['success'] != undefined){//渲染成功后的操作
			map['success'](data);
		}
		var obthis = this;
		$(".pagination").each(function() {// 分页条显示
			var targetpage=$(this).data('target');
			if((targetpage==null || targetpage=='datagrid') && obthis.datagrid=='datagrid'){
				if(page!=undefined)
					obthis.setPage(page.pageNo, page.totalPages, $(this));
			}else if(targetpage == obthis.datagrid){
				if(page != undefined)
					obthis.setPage(page.pageNo, page.totalPages, $(this));
			}
		});
	},
	this._generalHtml = function(obj) {
		if ($('#' + this.datagrid + 'Template') == undefined) {
			return '';
		}
		var oldhtml = $('#' + this.datagrid + 'Template').html();
		for ( var key in obj) {
			if (typeof (obj[key]) == "object") {
				var obj2 = obj[key];
				for ( var key2 in obj2) {
					if (obj2[key2] != null) {
						var reg = new RegExp("#" + key + "." + key2
								+ "#", "g");
						oldhtml = oldhtml.replace(reg, obj2[key2]);
					}
				}
			} else {
				if (obj[key] != null) {
					var reg = new RegExp("#" + key + "#", "g");
					oldhtml = oldhtml.replace(reg, obj[key]);
				}
			}
		}
		var reg = new RegExp("#[a-z]+#", "g");
		oldhtml = oldhtml.replace(reg, "&nbsp;");
		var reg = new RegExp("#.+#", "g");
		oldhtml = oldhtml.replace(reg, "&nbsp;");
		return oldhtml;
	},
	this.setPage = function(currentPage, totalPages, elem) {
		var obthis = this;
		if (totalPages <= 1) {
			$(elem).empty();
			$(elem).hide();
			return;
		}
		var options = {
			bootstrapMajorVersion : 3,
			useBootstrapTooltip : false,
			alignment : "center",
			currentPage : currentPage ? currentPage : 1,
			numberOfPages :10,
			totalPages : totalPages,
			itemTexts : function(type, page, current) {
				switch (type) {
				case "first":
					return "首页";
				case "prev":
					return "上一页";
				case "next":
					return "下一页";
				case "last":
					return "尾页";
				case "page":
					return page;
				}
			},
			tooltipTitles : function(type, page, current) {
				switch (type) {
				case "first":
					return "第一页";
				case "prev":
					return "上一页";
				case "next":
					return "下一页";
				case "last":
					return "最后一页";
				case "page":
					return (page === current) ? "当前页是 " + page
							: " 去第 " + page+" 页";
				}
			},
			pageUrl : function(type, page, current) {
				return "javascript:void(0)";
			},onPageChanged:function(event, originalEvent,page){
                obthis.searchData(page);
            }
		};
		$(elem).bootstrapPaginator(options);
		$(elem).css("display", "inline-block");
	};
}


/**
* 自定义弹出框类，以免更换弹出框架对整体改动
*/
function MyDialog() {
	this.open = function(map){
		var url = map['url'], id = map['id'], width = map['width'], height = map['height'], isFull = map['isFull'], html = null;
		this.callback = map['success'];
		if (id == undefined) {
			var num = parseInt(Math.random() * 100);
			id = num + "dlg";
		}
		if (url == undefined || id == undefined) {
			alert("Dialog's url and id is requried,please check your configuration.");
		}
		if(url.indexOf(contextPath)==-1){
			url=contextPath+url;
		}
		if ($('#_dlg' + id).length > 0) {
			$('#_dlg' + id).remove();
		}
		if (isFull == true) {
			width =width==undefined?$(document).width():width;
			height =height==undefined? $(document).height():height;
			html = '<div id="_dlg'
					+ id
					+ '" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">'
					+ '<div class="modal-dialog" style="height:'
					+ height
					+ 'px;width:'
					+ width
					+ 'px;margin:0;">'
					+ '<div class="modal-body" style="height:'
					+ height
					+ 'px;width:'
					+ width
					+ 'px;padding:0;overflow:hidden;"><iframe name="'
					+ id
					+ 'frame"'
					+' id="'+id+'frame" '
					+'width="'
					+ width
					+ 'px" height="'
					+ height
					+ 'px" src="'
					+ url
					+ '" frameBorder="0" ></iframe></div></div></div></div>';
		} else {
			if (width == undefined || width > ($(document).width() - 40)) {
				width = $(document).width() - 40;
			}
			if (height == undefined || height > ($(document).height() - 60)) {
				height = $(document).height() - 60;
			}
			html = '<div id="_dlg'
					+ id
					+ '" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">'
					+ '<div class="modal-dialog" style="height:'
					+ height
					+ 'px;width:'
					+ width
					+ 'px"><div class="modal-content"><div class="dialog-close" data-dismiss="modal" title="关闭"></div>'
					+ '<div class="modal-body"><iframe name="'
					+ id
					+ 'frame"'
					+' id="'+id+'frame" '
					+'width="'
					+ (width - 30)
					+ 'px" height="'
					+ (height - 40)
					+ 'px" src="'
					+ url
					+ '" frameBorder="0" ></iframe></div></div></div></div>';
		}

		$("body").append(html);

		$('#_dlg' + id).on('hidden.bs.modal', function(e) {
			/* 说明父界面还有弹出层 */
			if ($(".modal-backdrop").length > 0) {
				$("body").addClass("modal-open");
			}
			$(this).remove();
		});
		$('#_dlg' + id).modal("show");
	},
	this.alert=function(content,callback){//提示框
		if(typeof(bootbox)=='undefined'){
			alert(content);
			return;
		}
	    bootbox.alert(content,callback);
	},
	this.close=function() {// 关闭窗口
		var iframename = window.name;
		var divid = iframename.replace("frame", '');
		if (window.parent == null)
			return;
		var obj = $('#_dlg' + divid, window.parent.document);
		obj.next("div.modal-backdrop").remove();
		obj.remove();
		$('#_dlg' + divid).modal("hide");
		if (this.callback) {
			this.callback();
		}
	},
	this.notice=function(content,time,callback){
		if(typeof(bootbox)=='undefined'){
			return;
		}
		 bootbox.alert(content);
		if(time>0){
			window.setTimeout(function(){
				$("button[data-bb-handler=ok]").click();
				if(callback != undefined){
					callback();
				}
			}, time);
		}
	},
	this.confirm = function(content,yesCallback,noCallback){//确认框
		bootbox.confirm(content, function(result){
			if(result==true){
				yesCallback();
			}else{
				if(noCallback != undefined){
					noCallback();
				}
			}
		}); 
	},
	this.date=function(ob,callback){
		var format='yyyy-mm-dd';
		var nowDate=new Date();
		$(ob).datetimepicker({
	        language:  'zh-CN',
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 3,
			//forceParse: 0,
			format:format,
			startDate: "1920-1-1",
			initialDate:nowDate.format("yyyy-MM-dd")
	    });
		if(callback!=undefined){
			$(ob)
			.datetimepicker()
			.on('changeDate', function(ev){
				callback(this);
			});
		}
	},this.time=function(ob,callback,tdate){
		if(tdate==undefined){
			tdate=new Date();
		}
		$(ob).datetimepicker({
	        language:  'zh-CN',
			weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 1,
			//forceParse: 0,
			format:'hh:ii'
			//startDate:tdate.format("yyyy-MM-dd")
	    });
		if(callback!=undefined){
			$(ob)
			.datetimepicker()
			.on('changeMinute', function(ev){
				callback(ev.target,ev.date);
			});
		}
	},this.datetime=function(ob,callback){
		var format='yyyy-mm-dd hh:ii:ss';
		var nowDate=new Date();
		$(ob).datetimepicker({
	        language:  'zh-CN',
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView:1,
			//forceParse: 0,
			format:format,
			startDate: "1920-1-1",
			initialDate:nowDate.format("yyyy-MM-dd")
	    });
		if(callback!=undefined){
			$(ob)
			.datetimepicker()
			.on('changeDate', function(ev){
				callback(this);
			});
		}
	};
}

function $Search(map) {
	var s = new SystemSearchTool(map);
	return s;
}
function $Crud(map) {
	var s = new SystemOperator(map);
	return s;
}
function $Dialog(){
	var s = new MyDialog();
	return s;
}

/**
* Retorna la trama requerida para hacer un POST del
* formulario indicado usando Ajax
* formName: Nombre del formulario 
*/
function getFormValues(formName)
{
 	
 	returnString ="";
 	
 	if( formName == "" ) return returnString;
 	
 	formElements=document.forms[formName].elements;
 	
 	for ( var i=formElements.length-1; i>=0; --i ) {
 		if (formElements[i].getAttribute("name") != null && formElements[i].getAttribute("name") != "" && formElements[i].getAttribute("type") != "button" && formElements[i].getAttribute("type") != "submit" && formElements[i].getAttribute("type") != "reset"){  /*add radio box elements analysis.*/
 		    if ((formElements[i].type != "radio" && formElements[i].type != "checkbox" && formElements[i].getAttribute("dependent") == null)){ //不是多选或单选,并且无前置关联.
 			    var isDependent = false;
     			for ( var j=formElements.length-1; j>=0; --j ){ /*检查哪些控件与本控件前置关联*/
     			    if(formElements[j].getAttribute("dependent") == formElements[i].id  && formElements[j].name != null && formElements[j].name != ""){
     			        isDependent = true; /*本控件被引用*/
             			if(formElements[i].value!="")
                 			returnString = returnString + formElements[j].name + "=" + encodeURIComponent(formElements[j].value) + "&";
     			    }
     			}
     			if(!isDependent)
         			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
         		else if(formElements[i].value!="")/*被引用,并且值不为空*/
         			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
     		    
 		    }else if(formElements[i].getAttribute("dependent") != null){/*存在前置关联*/
                continue;
            }else if(formElements[i].checked){/*单选或多选,并选中*/
                /*选把自己传上*/
     			returnString = returnString + formElements[i].name + "=" + encodeURIComponent(formElements[i].value) + "&";
     			for ( var j=formElements.length-1; j>=0; --j ){ /*检查哪些控件与本控件前置关联*/
     			    if(formElements[j].getAttribute("dependent") == formElements[i].id && formElements[j].name != null && formElements[j].name != ""){
             			returnString = returnString + formElements[j].name + "=" + encodeURIComponent(formElements[j].value) + "&";
     			    }
     			}
 		    }
 		}
 	}
	
	if(returnString != "")
	 	returnString = returnString.substring(0, returnString.length - 1);

 	return returnString;

}

/*俱乐部命名空间*/
window["zhiban"] = {};



$(document).ready(function() {
	
	var fileuploadfunc;
	
	$FileUpload = function(map) {
		return new $FileUpload.fn.init(map);
	}, $FileUpload_init = null,
	
	$FileUpload.fn = $FileUpload.prototype = {

	};
	
	$FileUpload_init = $FileUpload.fn.init = function(id) {
		var obthis = this;
		this.id=id;
		this.fileupload = function(map) {
			if(map==undefined){
				map={};
			}
			obthis.fileuploadfunc=map['success'];
			this.fileSize==map['fileSize'];
			this.accept==map['accept'];
			if(this.fileSize==undefined){
				this.fileSize=5*1024;//默认为5MB
			}
			obthis.formid=obthis.id;
			$('#' + this.id).find('.fileupload-buttons').find('input').each(function() {
				$(this).data("formid",obthis.id);
				$(this).change(function(evt) {
					obthis.opersubmit(this,evt);
				});
				if($(this).propertychange!='' && $(this).propertychange!=null )
				$(this).propertychange(function(evt) {
					obthis.opersubmit(this,evt);
				});
			});
			return this;
		}, this.opersubmit = function(ob,evt) {
			var format=$(ob).attr("accept");
			if(!format){
				format=obthis.accept;
			}
			var filepath=$(ob).val();
			var suffix=this.getfileSuffix(filepath);
			if(format!=undefined &&  format.indexOf(suffix)==-1){
				$Dialog().alert("文件格式不对");
				return;
			}
			var files = evt.target.files; // 获得文件对象   
			if(files!=undefined && this.fileSize>0){
				 for (var i = 0, f; f = files[i]; i++)   
			        {   
						   if(f.size > this.fileSize*1024)   
				            {   
							   $Dialog().alert('文件最大 是' + this.fileSize + ' kb');
				                return;
				            }   
			        }
			}

			var html=$('<div id="progressDiv" class=progressDiv><div class="uploadtext">已上传<span class=processtext>0%</span></div><div class="progress"><div class="progress-bar"  style="width:0%;"></div></div></div>');
			$("#progressDiv").remove();
			//$(document.body).append(html);
			var options = {   
			        beforeSend: function() {
			        	$("#progressDiv").find("div.progress-bar").css("width","0%");
			        	$("#progressDiv").find(".processtext").html("0%");
			        },
			        uploadProgress: function(event, position, total, percentComplete) {
			        	$("#progressDiv").find(".progress-bar").css("width",percentComplete+"%");
			        	$("#progressDiv").find(".processtext").html(percentComplete+"%");
			        },
			        error:function(data){
			                $Dialog().alert("上传失败");
			                $("#progressDiv").remove();
			        },
			        success: function(html, status) {
			        	$("#progressDiv").remove();
			        	obthis.callbackparent(html);
			        }
			};
			$('#' + obthis.formid).submit();
			return;
			if (obthis.isIE()) {
			    if (obthis.IEVersion() < 10) {
			        if (obthis.IEVersion() > 7) {
			        	var action=$('#' + obthis.formid).attr("action");
			        	$('#' + obthis.formid).attr("action",action);
			        	$('#' + obthis.formid).submit();
			        	 return;
			        }else{
			            
			        };
			    };
			 };
			if($('#' + obthis.formid).ajaxSubmit!=undefined)
				$('#' + obthis.formid).ajaxSubmit(options);
		},this.callbackparent=function(data){
			var callback=obthis.fileuploadfunc;
			if(callback!=undefined)
				callback(data);
		},this.getfileSuffix=function(file_name){
			var result =/\.[^\.]+/.exec(file_name);
			return (result+'').toLowerCase().replace(".", '');
		},this.upload = function(map) {//文件上传
			if(map==undefined){
				map={};
			}
			var url='';
			if(map.url==undefined){
				 url=contextPath+'/file/upload';
			}else{
				url=contextPath+map.url;
			}
			var btnobj=$("#"+this.id);
			var fid=parseInt(Math.random() * 1000);
			var formid="formid"+fid;
			var divid='dupload'+fid;
			if($("#"+divid).length>0){
				return;
			}
			obthis.fileuploadfunc=map['success'];
			fileuploadfunc=obthis.fileuploadfunc;
			this.fileSize=map['fileSize'];
			this.accept=map['accept'];
			this.paramid=map['paramid'];
			var thumb=map['thumb'];
			if(this.fileSize==undefined){
				this.fileSize=5*1024;//默认为5MB
			}
			if(thumb){
				url=url+'?thumb='+thumb;
			}
			
			var formObj=$('<form action='+url+' id='+formid+' method=post enctype="multipart/form-data" target="hiddenframe"></form>');
			btnobj.wrap(formObj);
			var fpdivobj=$('<div id='+divid+' class="ccms_upload"></div>');
			formObj=$("#"+formid);
			$("#"+formid).wrap(fpdivobj);
			var inputhidobj=$('<input type="file" name="file" />');
			formObj.append(inputhidobj);
			inputhidobj=$('<input type="hidden" name="paramid"  id="paramid"  value="" />');
			formObj.append(inputhidobj);
			inputhidobj=$('<input type="hidden" name="paramid1"  id="paramid1"  value="" />');
			formObj.append(inputhidobj);
			var frameobj=$('<iframe style="display:none" name="hiddenframe"  id="hiddenframe"  /></iframe>');
			$(document.body).append(frameobj);
			obthis.formid=formid;
			formObj.find('input[type=file]').each(function() {
				$(this).data("formid",formid);
				$(this).attr("accept",obthis.accept);
				$(this).change(function(evt) {
					obthis.opersubmit(this,evt);
				});
				if($(this).propertychange!='' && $(this).propertychange!=null )
				$(this).propertychange(function(evt) {
					obthis.opersubmit(this,evt);
				});
			});
			return this;
		},this.setFormat=function(format){//设置格式
			if(format){
				var btnobj=$("#"+this.id);
				if(btnobj.parent().find('input[type=file]').length>0)
				btnobj.parent().find('input[type=file]').attr("accept",format);
			}
		},this.initparam=function(paramid){
			if(paramid!=undefined){
				$("#paramid").val(paramid);
			}
		},this.initparam1=function(paramid){
			if(paramid!=undefined){
				$("#paramid1").val(paramid);
			}
		},this.isIE=function(){
			if(!!window.ActiveXObject || "ActiveXObject" in window){
				return true;
			}else{
				return false;
			}
		},this.IEVersion=function(){
		  var rv = -1;
		  if (navigator.appName == 'Microsoft Internet Explorer'){
		    var ua = navigator.userAgent;
		    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		    if (re.exec(ua) != null)
		      rv = parseFloat( RegExp.$1 );
		  }else if (navigator.appName == 'Netscape'){
		    var ua = navigator.userAgent;
		    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		    if (re.exec(ua) != null)
		      rv = parseFloat( RegExp.$1 );
		  }
		  return rv;
		},this.callback=function(){
			if(fileuploadfunc!=undefined){
				fileuploadfunc();
			}
		}
	};
	
	window["zhiban"]["file"] = $FileUpload;
	
	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1,
			"d+" : this.getDate(),
			"h+" : this.getHours(),
			"m+" : this.getMinutes(),
			"s+" : this.getSeconds(),
			"q+" : Math.floor((this.getMonth() + 3) / 3),
			"S" : this.getMilliseconds()
		};
		if (/(y+)/.test(format))
			format = format.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	};
	
	Date.prototype.addDate =function(Number,strInterval) {  
		if(strInterval==undefined){
			strInterval='d';
		}
	    var dtTmp = this;    
	    switch (strInterval) {     
	  
	        case 's' :return new Date(dtTmp.getTime() + (1000 * Number));    
	  
	        case 'n' :return new Date(dtTmp.getTime() + (60000 * Number));    
	  
	        case 'h' :return new Date(dtTmp.getTime() + (3600000 * Number));    
	  
	        case 'd' :return new Date(dtTmp.getTime() + (86400000 * Number));    
	  
	        case 'w' :return new Date(dtTmp.getTime() + ((86400000 * 7) * Number));    
	  
	        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());    
	  
	        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());    
	  
	        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());    
	  
	    }    
	};   

	//| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串    
	  
	//+---------------------------------------------------    
	  
	Date.prototype.DateDiff = function(strInterval, dtEnd) {     
	    var dtStart = this;    
	    if (typeof dtEnd == 'string' )//如果是字符串转换为日期型    
	  
	    {     
	        dtEnd = StringToDate(dtEnd);    
	  
	    }    
	    switch (strInterval) {     
	  
	        case 's' :return parseInt((dtEnd - dtStart) / 1000);    
	  
	        case 'n' :return parseInt((dtEnd - dtStart) / 60000);    
	  
	        case 'h' :return parseInt((dtEnd - dtStart) / 3600000);    
	  
	        case 'd' :return parseInt((dtEnd - dtStart) / 86400000);    
	  
	        case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));    
	  
	        case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);    
	  
	        case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();    
	  
	    }    
	};    
	  
	    
	  
	//+---------------------------------------------------    
	  
	//| 日期输出字符串，重载了系统的toString方法    
	  
	//+---------------------------------------------------    
	  
	Date.prototype.toString = function(showWeek)    
	  
	{     
	  
	    var myDate= this;    
	  
	    var str = myDate.toLocaleDateString();    
	  
	    if (showWeek)    
	  
	    {     
	  
	        var Week = ['日','一','二','三','四','五','六'];    
	  
	        str += ' 星期' + Week[myDate.getDay()];    
	  
	    }    
	    return str;    
	};
	
	Date.prototype.getYearWeek=function(){//得到年第几周
		var myDate= this; 
		var a=myDate.getYear();
		var b=myDate.getMonth();
		var c=myDate.getDate();
		var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
		d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
		return Math.ceil(
		(d + ((date2.getDay() + 1) - 1)) / 7
		); 
	};
	
	 
	
	String.prototype.replaceAll = function(s1, s2) {
		return this.replace(new RegExp(s1, "gm"), s2);
	};
	String.prototype.endWith=function(str){  
		var reg = new RegExp(str+"$");  
		return reg.test(this);     
	};
	String.prototype.Trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	String.prototype.LTrim = function() {
		return this.replace(/(^\s*)/g, "");
	};
	String.prototype.RTrim = function() {
		return this.replace(/(\s*$)/g, "");
	};
	String.prototype.getBytes = function() {
		var cArr = this.match(/[^\x00-\xff]/ig);
		return this.length + (cArr == null ? 0 : cArr.length);
	};

});