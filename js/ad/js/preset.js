var actionroot=contextPath+$("#actionroot").val();
function PresetClass(){
	this.move = false; // 移动的初始化 
	this.initDiv = null; //拖拽对象 目标对象 
	this.relPos = {x: 0, y: 0};
	this.dragPos = {x1: 0, x2: 0, y1: 0, y2: 0};// 拖拽对象的四个坐标 
	this.screen_id=$("#screen_id").val();
	this.preset_id=null;
	this.gridNum=2;//默认的栅栏格个数
	this.leftWidth=20;//栅栏格距离左边的距离
	this.topHeight=20;//栅栏格距离上边的距离
	this.screenW=320;//单个屏幕墙的宽度
	this.screenH=180;//单个屏幕墙的高度
	this.dashedW=0;//磁力线宽度
	this.dashedH=0;//磁力线高度
	this.dashedRefW=0;//磁力线实际的分辨率宽
	this.dashedRefH=0;//磁力线实际的分辨率高
	this.preset_visibile_num=4;//默认的显示方案名称字数个数
	this.preset_num=6;
	this.adMap=null;
	this.screenMap=null;
	this.presetMap=null;
	this.regionMap=null;
	this.objPreset=null;
	this.objRegion=null;
	this.oldMap={};
	this.objName=false;
	this.isTouch=false;
	this.isChange=false;//是否改变字体
	this.isMove=false;//是否移动画面
	this.mouseMap={"mouseTop":0,"mouseLeft":0};
	this.preset={};
	//添加放大放小事件
	this.zoomSize = 1.0;//缩放比例
	
	this.init=function(){
		var obthis=this;
		this.initData();
		
		$("#screenList").on("click",function(){
			parent.$("#_dlgpresetDiv").modal('hide');
			//gotoPage("/action/project/saobao/ad/screen/crud");
		});
		$("#addPresetBtn").on("click",function(){
			obthis.addPreset();
		});
		$("#delPresetBtn").on("click",function(){
			obthis.delPreset();
		});
		$("#setGridImg").on("click",function(){
			obthis.setGridImg();
		});
		$("#save_unbind_btn").unbind();
		$("#save_unbind_btn").on("click",function(){
			obthis.saveUnbind();
		});
		$("#save_grid_btn").unbind();
		$("#save_grid_btn").on("click",function(){
			obthis.saveGrid();
		});
		$("#bigImg").unbind();
		$("#bigImg").on("click", function(){
			obthis.zoomSize += 0.1;
			$("#rightDiv").css("-webkit-transform", "scale("+obthis.zoomSize+")").css("-moz-transform", "scale("+obthis.zoomSize+")")
			 .css("-o-transform", "scale("+obthis.zoomSize+")").css("-ms-transform", "scale("+obthis.zoomSize+")")
			 .css("-webkit-transform-origin", "0 0").css("-moz-transform-origin", "0 0")
			 .css("-ms-transform-origin", "0 0").css("-o-transform-origin", "0 0");
		});
		$("#smallImg").unbind();
		$("#smallImg").on("click", function(){
			obthis.zoomSize -= 0.1;
			$("#rightDiv").css("-webkit-transform", "scale("+obthis.zoomSize+")").css("-moz-transform", "scale("+obthis.zoomSize+")")
			 .css("-o-transform", "scale("+obthis.zoomSize+")").css("-ms-transform", "scale("+obthis.zoomSize+")")
			 .css("-webkit-transform-origin", "0 0").css("-moz-transform-origin", "0 0")
			 .css("-ms-transform-origin", "0 0").css("-o-transform-origin", "0 0");
		});
		
	};
	this.setGridImg=function(){
		document.gridEditor.tuid.value=this.preset_id;
		document.gridEditor.gridx.value=this.presetMap[this.preset_id].gridx;
		document.gridEditor.gridy.value=this.presetMap[this.preset_id].gridy;
		$("#gridModal").modal();
	};
	this.saveGrid=function(){
		var obthis=this;
		obthis.preset.tuid=document.gridEditor.tuid.value;
		obthis.preset.gridx=document.gridEditor.gridx.value;
		obthis.preset.gridy=document.gridEditor.gridy.value;
		var url=actionroot+"/updategrid?id="+obthis.preset_id;
		ajaxCall(url,{
			method: "post",
			progress: true,
			form:"gridEditor",
			button:"save_rid_btn",
			dataType: "script",
			success: function() {
				var preset=obthis.presetMap[obthis.preset_id];
				if(preset.gridx!=obthis.preset.gridx || 
						preset.gridy!=obthis.preset.gridy){
					obthis.presetMap[obthis.preset_id].gridx=obthis.preset.gridx;
					obthis.presetMap[obthis.preset_id].gridy=obthis.preset.gridy;
					obthis.searchRegion();
					obthis.preset={};
				}
				$("#gridModal").modal('hide');
			}
		});
	};
	this.initData=function(){
		var obthis=this;
		obthis.objPreset = $Crud({
			formId:"presetEditor",  
			button:"save_preset_btn",
			modalId:"presetModal",
			insertBack:function(){
		       	obthis.insertPresetBack();
			},
			updateBack:function(){
				obthis.updatePresetBack();
			},
			validate:function(){
				var flag=$("#presetEditor").validate({
					rules: {
						preset_name: {
							required: true,
							rangelength: [1,64]
						},
						preset_alias:{
							required: true,
							rangelength: [1,64]
						}
					},
					messages: {
						preset_name:{
							required: "请输入方案名称",
							rangelength: "方案名称的长度为1到64位"
						},
						preset_alias:{
							required: "请选择方案别名",
							rangelength: "方案别名的长度为1到64位"
						}
					}
				});
				return flag;
			},
			check:function(){
				var tuid=document.presetEditor.tuid.value;
				if(tuid!=null && tuid!=''){
					obthis.preset={};
					obthis.preset.tuid=tuid;
					obthis.preset.preset_name=document.presetEditor.preset_name.value;
					obthis.preset.preset_alias=document.presetEditor.preset_alias.value;
				}
				return true;
			}
		}).init();
		obthis.searchScreen();
	};
	this.updatePresetBack=function(){
		var obthis=this;
		if(obthis.preset!={}){
			var tuid=obthis.preset.tuid;
			obthis.presetMap[tuid]=obthis.preset;
			var title=obthis.preset.preset_name+"("+obthis.preset.preset_alias+")";
			$("#rightUl li[value='"+tuid+"']").attr("title",title);
			var name=obthis.preset.preset_name;
			name=name.length>obthis.preset_visibile_num?name.substr(0,obthis.preset_visibile_num)+"…":name;
			$("#rightUl li[value='"+tuid+"'] a").html(name);
		}
		obthis.region={};
	};
	//查询广告信息
	this.searchAd=function(){
		var obthis=this;
		var url=actionroot+"/getad?preset_id="+this.preset_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				obthis.buildAd(data);
			}
		});
	};
	//创建广告
	this.buildAd=function(data){
		var json=data["rows"];
		json.pop();
		this.adMap={};
		var con="";
		for(var key in json){
			con+='<div id="" class="adDiv">'+
			'<div id="adImg'+json[key].tuid+'" class="adImg" ontouchmove="event.preventDefault()"></div>'+
			'<label  class="adSpan" value="'+json[key].tuid+'"  title="'+json[key].low_price+'—'+json[key].up_price+'">'+json[key].ad_code+'</label>'+
			'</div>';
			this.adMap[json[key].tuid]=json[key];
		}
		$("#leftDiv").html(con);
		
	};
	//查询屏幕墙下信息
	this.searchScreen=function(){
		var obthis=this;
		this.screenMap={};
		var url=actionroot+"/getscreen?screen_id="+this.screen_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var json=data["rows"];
				json.pop();
				for(var key in json){
					obthis.screenMap=json[key];
					obthis.searchPreset("init");
				}
			}
		});
	};
	//查询屏幕墙下的方案信息
	/* 是初始化查询 init 还是添加完之后查询 add*/
	this.searchPreset=function(type){
		var obthis=this;
		this.presetMap={};
		var url=actionroot+"/getpreset?screen_id="+this.screen_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var json=data["rows"];
				json.pop();
				if(json.length==0){
					document.presetEditor.preset_name.value="方案一";
					document.presetEditor.preset_alias.value="方案一";
					document.presetEditor.gridx.value=obthis.gridNum;
					document.presetEditor.gridy.value=obthis.gridNum;
					$("#save_preset_btn").click();
				}else{
					var con="";
					for(var key in json){
						if(key<obthis.preset_num+1){ //显示方案个数
							con+='<li';
							if(type=="init" && key=='0'){
								con+=' class="active" ';
								obthis.preset_id=json[key].tuid;
							}else if (type=="add" && obthis.preset_id==json[key].tuid){
								con+=' class="active" ';
							}
							if(key==obthis.preset_num){
								con+=' id="preset'+obthis.preset_num+'"';
							}
							con+='  value="'+json[key].tuid+'"  title="'+json[key].preset_name+'('+json[key].preset_alias+')" >';
							var name=json[key].preset_name;
							name=name.length>obthis.preset_visibile_num?name.substr(0,obthis.preset_visibile_num)+"…":name;
							con+='<a href="#regionDiv" data-toggle="tab" >'+name+'</a>';
							con+='</li>';
							obthis.presetMap[json[key].tuid]=json[key];
						}else{
							break;
						}
					}
					if(json.length>obthis.preset_num+1){
						con+='<div class="dropdown" style="float:left;color:#ffffff;">';
						con+='<a id="dLabel" class="dropdown-toggle" data-toggle="dropdown" href="#" >更多</a>';
						con+='<ul id="dropdownUL" class="dropdown-menu" role="menu" aria-labelledby="dLabel" >';
						for(var j=obthis.preset_num+1;j<json.length;j++){
							obthis.presetMap[json[j].tuid]=json[j];
							con+='<li id="li'+json[j].tuid+'" role="presentation"><a value="'+json[j].tuid+'" href=javascript:presetClass.jdAClick("'+json[j].tuid+'") role="menuitem"  title="'+json[j].preset_name+'('+json[j].preset_alias+')">'+(json[j].preset_name.length>(obthis.preset_visibile_num)?json[j].preset_name.substr(0,obthis.preset_visibile_num)+'……':json[j].preset_name)+'</a></li>';
						}
						con+='</ul>';
						con+='</div>';
					}
					$("#jtDiv").hide();
					$("#rightUl").html(con);
					obthis.presetEvent();
					obthis.searchRegion();
				}
			}
		});
	};
	this.jdAClick=function(val){
		var obthis=this;	
		var id=$("[id='preset"+obthis.preset_num+"']").attr("value");
		var name=obthis.presetMap[id].preset_name;
		var html_li=name.length>(obthis.planNameLength+1)?name.substr(0,obthis.planNameLength)+'……':name;
		var con='<li id="li'+id+'" role="presentation"><a value="'+id+'" href=javascript:presetClass.jdAClick("'+id+'") role="menuitem"  title="'+name+'('+obthis.presetMap[id].preset_alias+')">';
		con+=html_li;
		con+='</a></li>';
		$("#dropdownUL").append(con);
		var newName=obthis.presetMap[val].preset_name;
		$("[id='li"+val+"']").remove();
		var html_plan=newName.length>(obthis.preset_visibile_num+1)?newName.substr(0,obthis.preset_visibile_num)+'……':newName;
		$("[id='preset"+obthis.preset_num+"']").find("a").html(html_plan);
		$("[id='preset"+obthis.preset_num+"']").attr("value",val);
		$("[id='preset"+obthis.preset_num+"']").attr("title",newName+"("+obthis.presetMap[val].preset_alias+")");
		$("#rightUl li").removeAttr("class");
		$("#rightUl li[value='"+val+"']").attr("class","active");
		$("#rightUl li[value='"+val+"']").click();
		//$("#rightUl li[value='"+obthis.preset_id+"']").click();
		
	};
	this.encoderSpan=function(){
		var obthis=this;
		$('.resizeMe').find("img").unbind();
		$('.resizeMe').find("img").on("click",function(){
			var val=$(this).parent().attr("value");
			var region=obthis.regionMap[val];
			var regionlist=obthis.regionMap;
		//	alert(region.sound);
			if(region.sound=='1'){
				region.sound='0';
				regionlist[region.tuid].sound='0';
			}else{
				for(var key in regionlist){
					regionlist[key].sound='0';
				}
				region.sound='1';
				regionlist[region.tuid].sound='1';
			}
			obthis.saveAllRegionSound(regionlist,region);
		});
	};
	this.insertPresetBack=function(){
		var obthis=this;
		var url=actionroot+"/currval";
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var presetid=data.currval;
				obthis.preset_id=presetid;
				obthis.searchPreset("add");
			}
		});
	};
	this.insertRegion=function(map){
		var obthis=this;
		var url=actionroot+"/region/insert";
		ajaxCall(url,{
			method: "POST",
			progress: true,
			form: "regionEditor",
			button: "save_region_btn",
			dataType: "script",
			success: function() {
				obthis.insertRegionBack(map);
			}
		});
	};
	this.insertRegionBack=function(map){
		var obthis=this;
		var url=actionroot+"/region/currval";
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var regionid=data.currval;
				$("#encoderLabelNew").parent().attr("value",regionid);
				$("#encoderLabelNew").parent().attr("title",map.region_name);
				$("#encoderLabelNew").attr("value",regionid);
				$("#encoderLabelNew").attr("id","encoderLabel"+regionid);
				map.tuid=regionid;
				obthis.regionMap[regionid]=map;
				obthis.encoderSpan();
			}
		});
	};
	//查询屏幕分区信息
	this.searchRegion=function(){
		var obthis=this;
		this.regionMap={};
		var url=actionroot+"/region/crud?preset_id="+this.preset_id;
		ajaxCall(url,{
			method: "GET",
			progress: true,
			dataType: "json",
			success: function(data) {
				var json=data["rows"];
				json.pop();
				obthis.regionMap={};
				for(var key in json){
					obthis.regionMap[json[key].tuid]=json[key];
				}
				obthis.drawDash();
				obthis.searchAd();
			}
		});
	};
	this.drawDash=function(){
		var obthis=this;
		var libW=(obthis.screenW+2)*obthis.screenMap.rowy;
		var libH=(obthis.screenH+2)*obthis.screenMap.rowx;
		var con='';
		con+='<div id="divLib" class="divLib backgroundFilter" style="position:absolute;"></div>';
		$("#rightDiv").html(con);
		$("#divLib").css("width",libW);
		$("#divLib").css("height",libH);
		$("#divLib").css("left",obthis.leftWidth);
		$("#divLib").css("top",obthis.topHeight);
		//磁力线密度
		obthis.dashedW =libW/parseInt(obthis.screenMap.rowy)/parseInt(obthis.presetMap[obthis.preset_id].gridy);
		obthis.dashedH =libH/parseInt(obthis.screenMap.rowx)/parseInt(obthis.presetMap[obthis.preset_id].gridx);
		var w =obthis.screenMap.rowy*obthis.presetMap[obthis.preset_id].gridy+1;
		var h =obthis.screenMap.rowx*obthis.presetMap[obthis.preset_id].gridx+1;
		//生成磁力线格
		for(var i=0;i<=h;i++){
			for(var j=0;j<=w;j++){
				var wid=obthis.dashedW;
				var hei=obthis.dashedH;
				var left=(j-1)*obthis.dashedW+obthis.leftWidth;
				var top=(i-1)*obthis.dashedH+obthis.topHeight;
				if(i==0){
					hei=obthis.topHeight;
					top=0;
				}
				if(i==h){
					hei=obthis.topHeight;	
				}
				if(j==0){
					wid=obthis.leftWidth;
					left=0;
				}
				if(j==w){
					wid=obthis.leftWidth;	
				}
				$("#rightDiv").append($("<div/>").addClass("dashDiv").css({width:wid+"px",height:hei+"px",left:left+"px",top:top+"px"}));
			}
		}
		//屏幕墙行和列框架		
		var width=100/parseInt(obthis.screenMap.rowy);//解码器列表的宽度
		var height=100/parseInt(obthis.screenMap.rowx);//解码器列表的高度
		con="";
		for(var i=0;i<obthis.screenMap.rowx*obthis.screenMap.rowy;i++){
			con+='<div style="width:'+width+'%;height:'+height+'% ;"';
			con+=' class="encoderNone backgroundFilter" >';
			con+='</div>';
		}
		$("#divLib").append(con);
		//生成工具条
		if($("#hideDiv").length==0){
			var hideDiv='';
			hideDiv+='<div class="hideDiv backgroundFilter" id="hideDiv">';
			hideDiv+='<img title="置于顶层" src="'+contextPath+'/js/ad/img/topmost_big.png" class="hideImg" id="topImg" />';
			hideDiv+='<img title="上移一层" src="'+contextPath+'/js/ad/img/top_big.png" class="hideImg" id="topmostImg" />';
			hideDiv+='<img title="下移一层" src="'+contextPath+'/js/ad/img/bottom_big.png" class="hideImg" id="bottommostImg" />';
			hideDiv+='<img title="置于底层" src="'+contextPath+'/js/ad/img/bottommost_big.png" class="hideImg" id="bottomImg" />';
			hideDiv+='<img title="解除绑定" src="'+contextPath+'/js/ad/img/unbind_big.png" class="hideImg" id="unbindImg" />';
			hideDiv+='<img title="删除画面" src="'+contextPath+'/js/ad/img/delete_big.png" class="hideImg" id="deleteImg" />';
			hideDiv+='</div>';					
			$("#bottomDiv").append(hideDiv);
			obthis.hideDivBtn();
		}
		//生成屏幕墙分区
		obthis.dashedRefW=obthis.screenMap.width/obthis.presetMap[obthis.preset_id].gridy;//每个磁力线格的实际像素宽
		obthis.dashedRefH=obthis.screenMap.height/obthis.presetMap[obthis.preset_id].gridx;//每个磁力线格的实际像素高				
		var layerHtml ="";
		for(var key in obthis.regionMap){
			var lefts=(obthis.regionMap[key].startX/obthis.dashedRefW)*obthis.dashedW+obthis.leftWidth;
			var tops=(obthis.regionMap[key].startY/obthis.dashedRefH)*obthis.dashedH+obthis.topHeight;
			var widths=(obthis.regionMap[key].endX-obthis.regionMap[key].startX)/obthis.dashedRefW*obthis.dashedW;
			var heights=(obthis.regionMap[key].endY-obthis.regionMap[key].startY)/obthis.dashedRefH*obthis.dashedH;	
			layerHtml+='<div  ontouchmove="event.preventDefault()"  class="encoderDiv blackBorder resizeMe" ';
			layerHtml+=' value="'+obthis.regionMap[key].tuid+'"';
			layerHtml+=' title="'+obthis.regionMap[key].region_name+'"';
			layerHtml+=' startX="'+obthis.regionMap[key].startX+'" startY="'+obthis.regionMap[key].startY+'"';
			layerHtml+=' endX="'+obthis.regionMap[key].endX+'" endY="'+obthis.regionMap[key].endY+'"';
			layerHtml+=' style="';
			layerHtml+=' z-index:'+obthis.regionMap[key].level+';top:'+tops+'px; left:'+lefts+'px; width:'+widths+'px; height:'+heights+'px; cursor: default;"';
			layerHtml+='>';
			layerHtml+='<label class="encoderLabel" id="encoderLabel'+obthis.regionMap[key].ad_id+'" value="'+obthis.regionMap[key].ad_id+'" title="'+obthis.regionMap[key].ad_code+'">';
			layerHtml+=obthis.regionMap[key].ad_code;
			layerHtml+='</label>';
			
			if(obthis.regionMap[key].sound=='0'){
				layerHtml += '<img src="'+contextPath+'/js/ad/img/volume_no.png"  title="关闭音频" >';
			}else{
				layerHtml += '<img src="'+contextPath+'/js/ad/img/volume.png" title="打开音频"  >';
			}
			layerHtml+='</div>';
		}
		$("#rightDiv").append(layerHtml);
		$("#hideDiv").hide();
		obthis.encoderSpan();
	};
	this.presetEvent=function(){
		var obthis=this;
		$("#rightUl li").unbind();
		$("#rightUl li").on("click",function(){
			var val=$(this).attr("value");
			obthis.preset_id=val;
			obthis.searchRegion();
		});
		$("#rightUl li").on("dblclick",function(){
			var val=$(this).attr("value");
			obthis.preset_id=val;
			document.presetEditor.tuid.value=val;
			document.presetEditor.preset_name.value=obthis.presetMap[val].preset_name;
			document.presetEditor.preset_alias.value=obthis.presetMap[val].preset_alias;
			document.presetEditor.gridx.value=obthis.presetMap[val].gridx;
			document.presetEditor.gridy.value=obthis.presetMap[val].gridy;
			$("#presetModal").modal("show");
		});
		$("#dropdownUL li").unbind();
	};
	this.addPreset=function(){
		clearForm("presetEditor");
		document.presetEditor.tuid.value='';
		document.presetEditor.gridx.value=this.gridNum;
		document.presetEditor.gridy.value=this.gridNum;
		$("#presetModal").modal('show');
	};
	this.delPreset=function(){
		var obthis=this;
		$Dialog().confirm("确定要删除该方案？",function(){
			var url=actionroot+"/delete?id="+obthis.preset_id;
			ajaxCall(url,{
				method: "post",
				progress: true,
				dataType: "script",
				success: function() {
					obthis.searchPreset("init");
				}
			});
		});
	};
	//点击画面  obj是点击的画面对象
	this.canvasClick=function(obj){
		$(".resizeMe").attr("class", "encoderDiv blackBorder resizeMe");				
		obj.attr("class", "encoderDiv redBorder resizeMe");
		var regionId=$(".redBorder").attr("value");
		var map=this.regionMap[regionId];
		this.setRegionValue(map);
		$("#hideDiv").show();
	};
	this.updateRegion=function(region){
		var obthis=this;
		this.setRegionValue(region);
		var url=actionroot+"/region/update";
		ajaxCall(url,{
			method: "POST",
			progress: true,
			form: "regionEditor",
			button: "save_region_btn",
			dataType: "script",
			success: function() {
				obthis.regionMap[region.tuid]=region;
			}
		});
	};
	this.setRegionValue=function(map){
		if(map.tuid!=null&&map.tuid!=undefined){
			document.regionEditor.tuid.value=map.tuid;
		}
		document.regionEditor.preset_id.value=map.preset_id;
		document.regionEditor.ad_id.value=map.ad_id;
		document.regionEditor.ad_code.value=map.ad_code;
		document.regionEditor.region_name.value=map.region_name;
		document.regionEditor.startx.value=map.startX;
		document.regionEditor.starty.value=map.startY;
		document.regionEditor.endx.value=map.endX;
		document.regionEditor.endy.value=map.endY;
		document.regionEditor.width.value=map.width;
		document.regionEditor.height.value=map.height;
		document.regionEditor.level.value=map.level;
		document.regionEditor.sound.value=map.sound;
	};
	this.saveAllRegionSound=function(regionlist,region){
		var obthis=this;
		var url = actionroot+"/region/updatesound?";
		var con='';
		for(var key in regionlist){
			con+="&tuid="+key;
			con+="&sound="+regionlist[key].sound;
		}
		url+=con.substr(1,con.length);
		ajaxCall(url,{
	        method: "post",
	        progress: true,
	        form: "formEditor",
	        dataType: "script",
	        success: function(data) {
	        	obthis.regionMap=regionlist;
				if(region.sound=='0'){
					$(".resizeMe img").attr("src",contextPath+"/js/ad/img/volume_no.png");
					$(".resizeMe img").attr("title","打开音频");
				}else{
					$(".resizeMe img").attr("src",contextPath+"/js/ad/img/volume_no.png");
					$(".resizeMe img").attr("title","打开音频");
					$(".resizeMe[value='"+region.tuid+"'] img").attr("src",contextPath+"/js/ad/img/volume.png");
					$(".resizeMe[value='"+region.tuid+"'] img").attr("title","关闭音频");
				}
	        }
	    });
	};
	this.saveAllRegion=function(regionlist){
		var obthis=this;
		var url = actionroot+"/region/updatelevel?";
		var con='';
		for(var key in regionlist){
			con+="&tuid="+key;
			con+="&level="+regionlist[key].level;
			con+="&sound="+regionlist[key].sound;
		}
		url+=con.substr(1,con.length);
		ajaxCall(url,{
	        method: "post",
	        progress: true,
	        form: "formEditor",
	        dataType: "script",
	        success: function(data) {
	        	obthis.regionMap=regionlist;
	        }
	    });
	};
	this.hideDivBtn=function(){
		var obthis=this;
		//置顶按钮		
		$("#topImg").unbind("click");
		$("#topImg").on("click",function(){
			var index=parseInt($(".redBorder").css("z-index"));
			var length=$(".resizeMe").length;
			var regionlist=obthis.regionMap;
			if(length-1>index){
				$(".resizeMe").each(function(){
					if(parseInt($(this).css("z-index"))>index){
						var level=parseInt($(this).css("z-index"))-1;
						var val=$(this).attr("value");
						regionlist[val].level=level;
						$(this).css("z-index",level);
					}
				});
				$(".redBorder").css("z-index",$(".resizeMe").length-1);
				var vals=$(".redBorder").attr("value");
				regionlist[vals].level=$(".resizeMe").length-1;
				obthis.saveAllRegion(regionlist);
			}else{
				$Dialog().alert("本画面已是最顶层");
			}
		});		
		//上移一层按钮	
		$("#topmostImg").unbind("click");
		$("#topmostImg").on("click",function(){				
			var index=parseInt($(".redBorder").css("z-index"));
			var length=$(".resizeMe").length;
			var regionlist=obthis.regionMap;
			if(length-1>index){
				$(".resizeMe").each(function(){
					if(parseInt($(this).css("z-index"))==index+1){
						var val=$(this).attr("value");
						regionlist[val].level=index;
						$(this).css("z-index",index);
						var vals=$(".redBorder").attr("value");
						$(".redBorder").css("z-index",index+1);
						regionlist[vals].level=index+1;
						obthis.saveAllRegion(regionlist);
					}					
				});
				
			}else{
				$Dialog().alert("本画面已是最顶层");
			}
		});
		//置底按钮	
		$("#bottomImg").unbind("click");
		$("#bottomImg").on("click",function(){
			var index=parseInt($(".redBorder").css("z-index"));
			var regionlist=obthis.regionMap;
			if(index>0){
				$(".resizeMe").each(function(){
					if(parseInt($(this).css("z-index"))<index){
						var level=parseInt($(this).css("z-index"))+1;
						var val=$(this).attr("value");
						regionlist[val].level=level;
						$(this).css("z-index",level);
					}
				});
				$(".redBorder").css("z-index",0);
				var vals=$(".redBorder").attr("value");
				regionlist[vals].level=0;
				obthis.saveAllRegion(regionlist);
			}else{
				$Dialog().alert("本画面已是最底层");
			}
		});	
		
		//下移一层按钮	
		$("#bottommostImg").unbind("click");
		$("#bottommostImg").on("click",function(){
			var index=parseInt($(".redBorder").css("z-index"));
			var regionlist=obthis.regionMap;
			if(index>0){
				$(".resizeMe").each(function(){
					if(parseInt($(this).css("z-index"))==index-1){
						var val=$(this).attr("value");
						regionlist[val].level=index;
						$(this).css("z-index",index);
						var redVal=$(".redBorder").attr("value");
						$(".redBorder").css("z-index",index-1);
						regionlist[redVal].level=index-1;
						obthis.saveAllRegion(regionlist);
					}				
				});
			}else{
				$Dialog().alert("本画面已是最底层");
			}
		});			
		//解除绑定按钮	
		$("#unbindImg").unbind("click");	
		$("#unbindImg").on("click",function(){
			obthis.unbindImg();
		});
		//删除画面按钮	
		$("#deleteImg").unbind("click");		
		$("#deleteImg").on("click",function(){
			obthis.deleteImg();
		});				
	};
	this.unbindImg=function(){
		var obthis=this;
		var val=$(".redBorder").attr("value");
		var oldAdId=obthis.regionMap[val].ad_id;
		var con="";
		for(var key in obthis.adMap){
			if(key != oldAdId ){
				con+="<option value='"+key+"'>"+obthis.adMap[key].ad_code+"</option>";	
			}							
		}
		$("#unbind_ad_id").html(con);
		document.unbindEditor.tuid.value=val;
		$("#unbindModal").modal();
		$(document).unbind("selectstart");
	};
	this.saveUnbind=function(){
		var obthis=this;
		$("#unbind_ad_code").val($("#unbind_ad_id").find("option:selected").text());
		var url=actionroot+"/region/unbind";
		ajaxCall(url,{
			method: "post",
			form:"unbindEditor",
			button: "save_unbind_btn",
			progress: true,
			dataType: "script",
			success: function() {
				$("#unbindModal").modal('hide');
				obthis.searchRegion();
			}
		});
	};
	this.deleteImg=function(){
		var obthis=this;
		var regionId=$(".redBorder").attr("value");//当前选中的画面
		$Dialog().confirm("确定要删除该屏分区？",function(){
			var url=actionroot+"/region/delete?id="+regionId;
			ajaxCall(url,{
				method: "post",
				progress: true,
				dataType: "script",
				success: function() {
					$("#rightUl li[value='"+obthis.preset_id+"']").click();
				}
			});
		});
	};
}
var presetClass=null;
var leftObject = null;
$(document).ready(function() {
	presetClass=new PresetClass();
	presetClass.init();
	console.info($(document).height()+"///"+$("#leftDiv").offset().top);
	$("#leftDiv").css("height",($(document).height()-120)+"px");
	$("#scrollDiv").css("height", ($(document).height()-120)+"px");
	
});


function resizeObject() {
	this.el = null; //pointer to the object
	this.dir = "";  //type of current resize (n, s, e, w, ne, nw, se, sw)
	this.grabx = null; //Some useful values
	this.graby = null;
	this.width = null;
	this.height = null;
	this.left = null;
	this.top = null;
	this.objName=false;
	this.isTouch=false;
	this.isChange=false;//是否改变字体
	this.isMove=false;//是否移动画面
};
//Find out what kind of resize! Return a string inlcluding the directions
function getDirection(el, event) {
	var xPos, yPos, offset, dir;
	dir="";
	xPos = event.offsetX || event.layerX ;
	yPos = event.offsetY || event.layerY ;
	offset = 10; //The distance from the edge in pixels
	if (yPos<(offset-2 )&&yPos>1) {
		dir += "n";
	}else if (yPos > (el.offsetHeight-offset) && yPos < (el.offsetHeight-1)) {
		dir += "s";
	}
	if (xPos<(offset-2)&& xPos>1 ) {
		dir += "w";
	}else if (xPos > (el.offsetWidth-offset) && xPos < (el.offsetWidth-1)){ 
		dir += "e";	
	}	
	return dir;
};
function getDirectionTouch(id) {
	var dir=id;
	return dir;
};

function getReal(el) {
	temp = el;
	while ((temp != null) && (temp.tagName != "BODY")) {
		if (temp.className == "encoderDiv redBorder resizeMe") {
			el = temp;
			return el;
		}
		temp = temp.parentElement;
	}
	return el;
};
var leftDiv = document.getElementById("leftDiv");
var rightDiv = document.getElementById("rightDiv");
var hammertime = new Hammer(leftDiv, {dragMaxTouches : 0,preventDefault : false});
var hammertimes = new Hammer(rightDiv, {dragMaxTouches : 0,preventDefault : false});
var doc=document;
var dochammertime = new Hammer(document, {dragMaxTouches : 0,preventDefault : false});
var last_touches = [];
var fragment = document.createDocumentFragment();

function leftTouchs() {
	Hammer.utils.each(last_touches, function(event) {
		event = event || window.event;
		var el = getReal(event.srcElement ? event.srcElement: event.target);
		if (Hammer.utils.inStr(el.className, "adImg")) {
			presetClass.initDiv = $(el).parent(); //拖拽对象 
			// 鼠标 与 目标元素的相对坐标 
			presetClass.relPos.x = event.pageX- $(el).offset().left;
			presetClass.relPos.y = event.pageY- $(el).offset().top;
			if(presetClass.relPos.x>=$(el).outerWidth()-10){
				presetClass.relPos.x-=10;
			}
			if(presetClass.relPos.x<10){
				presetClass.relPos.x=10;
			}
			if(presetClass.relPos.y>=$(el).outerHeight()-10){
				presetClass.relPos.y-=10;
			}
			if(presetClass.relPos.y<10){
				presetClass.relPos.y=10;
			}
			presetClass.move = true;
			var width = presetClass.initDiv.width();
			presetClass.initDiv.removeClass("decoderDiv").addClass("decoderDivDrag");
			presetClass.initDiv.css("z-index",$(".resizeMe").length);
			presetClass.initDiv.css({width:width+'px', left : (event.pageX - parseInt($(el).width()) / 2)+ 'px', top : (event.pageY - parseInt($(el).height()) / 2)+ 'px' });
			presetClass.initDiv.appendTo($("body"));
		}
	});
}
function leftDrag() {
	Hammer.utils.each(last_touches, function(event) {
		event = event || window.event;
		var el = getReal(event.srcElement ? event.srcElement : event.target);
		if ((Hammer.utils.inStr(el.className, "adImg") || presetClass.move ) ) {
			if (!presetClass.move) { return; }
			// 下列代码是 if(move)的 程序 
			// 目标元素随鼠标移动的坐标 
			presetClass.dragPos.x1 = event.pageX - presetClass.relPos.x;
			presetClass.dragPos.y1 = event.pageY - presetClass.relPos.y;
			presetClass.dragPos.x2 = presetClass.dragPos.x1 + presetClass.initDiv.innerWidth();
			presetClass.dragPos.y2 = presetClass.dragPos.y1 + presetClass.initDiv.innerHeight();
			presetClass.initDiv.css({ left : presetClass.dragPos.x1 + 'px', top : presetClass.dragPos.y1 + 'px' });
			if (presetClass.initDiv.offset().left > $("#rightDiv") .offset().left && presetClass.initDiv.offset().top > $("#rightDiv").offset().top) {
				var left = presetClass.initDiv.offset().left - $("#rightDiv").offset().left;
				var top = presetClass.initDiv.offset().top - $("#rightDiv").offset().top ;
				left = Math.round((left-presetClass.leftWidth) / presetClass.dashedW) * presetClass.dashedW+presetClass.leftWidth;
				top = Math.round((top-presetClass.topHeight) / presetClass.dashedH) * presetClass.dashedH +presetClass.topHeight;
				var width = $(".encoderNone").outerWidth()+2;
				var height = $(".encoderNone").outerHeight()+2;
				var startX =parseInt((left-presetClass.leftWidth) / presetClass.dashedW ) * presetClass.dashedRefW;
				var startY =parseInt((top-presetClass.topHeight ) / presetClass.dashedH) * presetClass.dashedRefH;
				var endX = startX + parseInt(width / presetClass.dashedW * presetClass.dashedRefW);
				var endY = startY + parseInt(height / presetClass.dashedH * presetClass.dashedRefH);
				var con = '<div class="bgColor"';
				con += ' startX="' + startX + '" startY="' + startY + '" ';
				con += ' endX="' + endX + '" endY="' + endY + '" ';
				var indexs=parseInt(presetClass.initDiv.css("z-index"))-1;
				con += ' style="position: absolute;z-index:'+indexs ;
				con += ';top:' + top + 'px;left:' + left + 'px; width:' + width + 'px;height:' + height + 'px;"';
				con += ' ></div>';
				$(".bgColor").remove();
				$("#rightDiv").append(con);
			} 
		}
	});
}
function leftRelease() {
	Hammer.utils.each(last_touches,function(event) {
		event = event || window.event;
		presetClass.isDown = false;
		if (!presetClass.move) {
			return;
		}
		if ($(".bgColor").length > 0) {
			presetClass.initDiv.children(":last").unbind();
			var value = presetClass.initDiv.children(":last").attr('value');
			presetClass.initDiv.children(":last").removeClass("adSpan");
			presetClass.initDiv.remove();
			var map={};
			map.preset_id=presetClass.preset_id;
			map.ad_code=presetClass.adMap[value].ad_code;
			map.ad_id=value;
			map.region_name="分区"+ ($(".resizeMe").length + 1);
			map.startX=parseInt($(".bgColor").attr("startX"));
			map.startY=parseInt($(".bgColor").attr("startY"));
			map.endX=parseInt($(".bgColor").attr("startX")) + parseInt(presetClass.screenMap.width);
			map.endY=parseInt($(".bgColor").attr("startY")) + parseInt(presetClass.screenMap.height);
			map.width=parseInt(presetClass.screenMap.width);
			map.height=parseInt(presetClass.screenMap.height);
			map.level=$(".resizeMe").length;
			map.sound="0";
			document.regionEditor.preset_id.value=map.preset_id;
			document.regionEditor.ad_code.value=map.ad_code;
			document.regionEditor.ad_id.value=map.ad_id;
			document.regionEditor.region_name.value=map.region_name;
			document.regionEditor.startx.value=map.startX;
			document.regionEditor.starty.value=map.startY;
			document.regionEditor.endx.value=map.endX;
			document.regionEditor.endy.value=map.endY;
			document.regionEditor.width.value=map.width;
			document.regionEditor.height.value=map.height;
			document.regionEditor.level.value=map.level;
			document.regionEditor.sound.value=map.sound;
			var cons = '';
			cons += '<div  ontouchmove="event.preventDefault()"  class="encoderDiv blackBorder resizeMe" ';
			cons += ' value="' + ($(".resizeMe").length) + '" ';
			cons += ' startX="' + map.startX + '" startY="' + map.startY + '" ';
			cons += ' endX="' + map.endX + '" endY="' + map.endY + '" ';
			cons += ' style="position: absolute;';
			cons += ' z-index:' + map.level + ';';
			cons += ' top:' + $(".bgColor").css("top") + ';';
			cons += ' left:' + $(".bgColor").css("left") + ';';
			cons += ' width:' + $(".bgColor").outerWidth() + 'px;';
			cons += ' height:' + $(".bgColor").outerHeight() + 'px;"';
			cons += ' title="'+presetClass.adMap[value].ad_name+'">';
			cons += ' <label class="encoderLabel" value="#" id="encoderLabelNew" title="'+map.ad_code+'">';
			cons += map.ad_code;
			cons += '</label> ';
			cons += '<img src="'+contextPath+'/js/ad/img/volume_no.png" title="打开音频" >';
			cons += '</div>';
			$("#rightDiv").append(cons);
			$(".bgColor").remove();
			presetClass.insertRegion(map);
		} else {
			presetClass.initDiv.appendTo($("#leftDiv"));//返回最初的父div内
		}
		presetClass.initDiv.removeClass("decoderDivDrag").addClass("decoderDiv").removeAttr("style"); //恢复拖拽对象初始的样式 
		presetClass.move = false;
	});
	leftDiv.appendChild(fragment);
}
function collectTouches(ev) {
	last_touches = ev.gesture.touches;
}

function allTouchs() {
	Hammer.utils.each(last_touches,function(event) {
		event = event || window.event;
		el = getReal(event.srcElement ? event.srcElement : event.target);
		if (el && el.className.indexOf("encoderDiv") < 0 && el.className != "hideImg"  && el.className.indexOf("hideDiv") < 0 ) {
			$("#hideDiv").hide();
			$(".resizeMe").attr("class","encoderDiv blackBorder resizeMe");
		} else if (el && el.className == "encoderDiv blackBorder resizeMe" ) {
			presetClass.canvasClick($(el));				
		}
	});
};

function rightTouchs() {
	Hammer.utils.each(last_touches, function(event) {
		event = event || window.event;
		var el = getReal(event.srcElement ? event.srcElement: event.target);
		if (el && el.className == "dashDiv") {
			presetClass.isDown = true;
			presetClass.mouseMap.mouseTop = event.pageY;
			presetClass.mouseMap.mouseLeft = event.pageX;
		}
		if (event.target.className == "encoderLabel" && $(event.target).parent().attr("class")!="encoderDiv redBorder resizeMe") {
			el=el.parentNode;
			presetClass.canvasClick($(el));
		}
		if (el && (el.className == "encoderDiv redBorder resizeMe" || event.target.className.indexOf("redtouch")>=0 || event.target.className.indexOf("touchBtn")>=0)) {
			if (el == null) {
				theobject = null;
				return;
			}
			
			if(event.target.className.indexOf("redtouch")>=0){
				dir = getDirectionTouch($(event.target).parent().attr("id"));
				el=event.target.parentNode.parentNode;
				leftObject = new resizeObject();
				leftObject.isTouch = true;
			}else  if(event.target.className.indexOf("touchBtn")>=0){
				dir = getDirectionTouch($(event.target).attr("id"));
				el=event.target.parentNode;
				leftObject = new resizeObject();
				leftObject.isTouch = true;
			}else {
				if(event.target.className.indexOf("encoderLabel")>=0){
					dir ="";
				}else{
					dir = getDirection(el, event);
					
				}
				leftObject = new resizeObject();
				leftObject.objName = true;
			}
			leftObject.dir=dir;
			leftObject.el = el;
			presetClass.oldMap.startX = leftObject.el.getAttribute("startX");
			presetClass.oldMap.startY = leftObject.el.getAttribute("startY");
			presetClass.oldMap.endX = leftObject.el.getAttribute("endX");
			presetClass.oldMap.endY = leftObject.el.getAttribute("endY");
			presetClass.oldMap.left = leftObject.el.style.left;
			presetClass.oldMap.top = leftObject.el.style.top;
			presetClass.oldMap.width = leftObject.el.style.width;
			presetClass.oldMap.height = leftObject.el.style.height;
			leftObject.grabx = event.clientX;
			leftObject.graby = event.clientY;
			leftObject.width = el.offsetWidth;
			leftObject.height = el.offsetHeight;
			leftObject.left = el.offsetLeft;
			leftObject.top = el.offsetTop;

			event.returnValue = false;
			event.cancelBubble = true;
		}
	});
}
function rightDrag() {
	Hammer.utils.each(last_touches,function(event) {
		event = event || window.event;
		var el, xMin, yMin;
		xMin = $(".dashDiv").width(); 	//The smallest width possible
		yMin = $(".dashDiv").height(); 	//height
		el = getReal(event.srcElement ? event.srcElement: event.target);
		if (el.className == "encoderDiv redBorder resizeMe" || (leftObject != null && leftObject.objName)|| (leftObject != null && leftObject.isTouch)) {
			leftObject.isMove=true;
			//Dragging starts here
			if (leftObject != null ) {
				if (dir == "" ) { //拖动
					var left = leftObject.left + event.clientX - leftObject.grabx;
					var top = leftObject.top + event.clientY - leftObject.graby;
					if (left < 0) {
						leftObject.el.style.left = "0px";
					} else {
						leftObject.el.style.left = left + "px";
					}
					if (top < 0) {
						leftObject.el.style.top = "0px";
					} else {
						leftObject.el.style.top = top + "px";
					}
				} else {//改变大小
					leftObject.isChange=true;
					if (dir.indexOf("e") != -1) {
						leftObject.el.style.width = Math.max(xMin,leftObject.width+ event.clientX- leftObject.grabx)+ "px";
					}
					if (dir.indexOf("s") != -1) {
						leftObject.el.style.height = Math.max(yMin,leftObject.height+ event.clientY- leftObject.graby)+ "px";
					}
					if (dir.indexOf("w") != -1) {
						var left = Math.min(leftObject.left + event.clientX- leftObject.grabx,leftObject.left + leftObject.width - xMin);
						if (left < 0) {
							leftObject.el.style.left = "0px";
						} else {
							leftObject.el.style.left = left + "px";
							leftObject.el.style.width = Math.max(xMin,leftObject.width - event.clientX + leftObject.grabx)+ "px";
						}
					}
					if (dir.indexOf("n") != -1) {
						var top = Math.min(leftObject.top + event.clientY - leftObject.graby,leftObject.top + leftObject.height- yMin);
						if (top < 0) {
							leftObject.el.style.top =  "0px";
						} else {
							leftObject.el.style.top = top + "px";
							leftObject.el.style.height = Math.max(yMin, leftObject.height - event.clientY + leftObject.graby) + "px";
						}
					}
					
					var layerW=parseFloat(leftObject.el.style.width);
					var layerH=(parseFloat(leftObject.el.style.height)-8)*0.42;
					var labelW=$(leftObject.el).find(".encoderLabel").html().length;
					var size=parseInt(layerW/labelW)+2;
					if(size>16){
						$(leftObject.el).find(".encoderLabel").css("font-size","16px");
					}else{
						$(leftObject.el).find(".encoderLabel").css("font-size",size+"px");
					}
					$(leftObject.el).find(".encoderLabel").css("top",layerH+"px");
					
				}
				var left = Math.round((parseFloat(leftObject.el.style.left)-presetClass.leftWidth + 1)/ presetClass.dashedW)* presetClass.dashedW+presetClass.leftWidth;
				var top = Math.round((parseFloat(leftObject.el.style.top)-presetClass.topHeight + 1) / presetClass.dashedH) * presetClass.dashedH +presetClass.topHeight;
				var width = Math.round((parseFloat(leftObject.el.style.width) - 1) / presetClass.dashedW) * presetClass.dashedW;
				var height = Math.round((parseFloat(leftObject.el.style.height) - 1) / presetClass .dashedH) * presetClass.dashedH;
				var con = '<div class="bgColor"';
				var indexs=parseInt($(el).css("z-index"))-1;
				con += ' style="position: absolute;z-index: '+indexs;
				con += ';top:' + top + 'px;left:' + left + 'px; width:' + width + 'px;height:' + height + 'px;"';
				con += ' ></div>';
				$(".bgColor").remove();
				$("#rightDiv").append(con);
				event.returnValue = false;
				event.cancelBubble = true;
			}
		}else if (el.className == "dashDiv") {
			if (presetClass.isDown) {
				var left = presetClass.mouseMap.mouseLeft - event.pageX;
				var top = presetClass.mouseMap.mouseTop - event.pageY;
				if (left != 0) {
					document.getElementById('scrollDiv').scrollLeft = document.getElementById('scrollDiv').scrollLeft+ left;
				}
				if (top != 0) {
					document.getElementById('scrollDiv').scrollTop = document.getElementById('scrollDiv').scrollTop+ top;
				}
			}
		} 
	});
}
function collectTouches(ev) {
	last_touches = ev.gesture.touches;
}
function rightRelease() {
	Hammer.utils.each(last_touches,function(event) {
		event = event || window.event;
		if (leftObject != null) {
			var el = getReal(event.srcElement ? event.srcElement: event.target);
			if (el&& el.className == "encoderDiv redBorder resizeMe" || leftObject.objName || leftObject.isTouch) {
				leftObject.objName = false;
				leftObject.isTouch = false;
				if(leftObject.isMove==true){
					leftObject.isMove=false;
				}else{
					return;
				}
				$(".bgColor").remove();
				var value = $(".redBorder").attr("value");
				var region = presetClass.regionMap[value];
				if(typeof(region)!= "undefined" ){
					//计算画面的宽和高
					//左边磁力线个数
					var lNum=Math.round((parseFloat(leftObject.el.style.left)-presetClass.leftWidth + 1)/ presetClass.dashedW );
					var left = lNum* presetClass.dashedW +presetClass.leftWidth ;
					//上边磁力线个数
					var tNum=Math.round((parseFloat(leftObject.el.style.top)-presetClass.topHeight + 1)/ presetClass.dashedH );
					var top = tNum * presetClass.dashedH +presetClass.topHeight;
					//横向磁力线个数
					var wNum=Math.round((parseFloat(leftObject.el.style.width) - 1) / presetClass.dashedW) ;
					var width =wNum * presetClass.dashedW;
					//竖向磁力线个数
					var hNum=Math.round((parseFloat(leftObject.el.style.height) - 1) / presetClass.dashedH);
					var height =  hNum* presetClass.dashedH;
					//画面的开始坐标和结束坐标
					region.startX = lNum * presetClass.dashedRefW;
					region.startY = tNum  * presetClass.dashedRefH;
					region.endX = region.startX + wNum * presetClass.dashedRefW;
					region.endY = region.startY + hNum * presetClass.dashedRefH;
					region.width=region.endX-region.startX;
					region.height=region.endY-region.startY;
					//设置画面的属性
					leftObject.el.setAttribute("startX", region.startX);
					leftObject.el.setAttribute("startY", region.startY);
					leftObject.el.setAttribute("endX", region.endX);
					leftObject.el.setAttribute("endY", region.endY);
					leftObject.el.style.left = left + "px";
					leftObject.el.style.top = top + "px";
					leftObject.el.style.width = width + "px";
					leftObject.el.style.height = height + "px";
					$(leftObject.el).find(".encoderLabel").css("top",(height-8)*0.42+"px");
					if(leftObject.isChange){
						leftObject.isChange=false;
						var layerW=parseFloat(leftObject.el.style.width);
						var labelW=$(leftObject.el).find(".encoderLabel").html().length;
						var size=parseInt(layerW/labelW)+2;
						if(size>16){
							$(leftObject.el).find(".encoderLabel").css("font-size","16px");
						}else{
							$(leftObject.el).find(".encoderLabel").css("font-size",size+"px");
						}
					}
					
					//更新页面上存储的对象
					presetClass.regionMap[value] = region;
					//保存画面
					presetClass.updateRegion( region);
				}else{
					$(".redBorder").attr("startX",presetClass.oldMap.startX);
					$(".redBorder").attr("startY",presetClass.oldMap.startY);
					$(".redBorder").attr("endX",presetClass.oldMap.endX);
					$(".redBorder").attr("endY",presetClass.oldMap.endY);				
					$(".redBorder").css("left",presetClass.oldMap.left);
					$(".redBorder").css("top",presetClass.oldMap.top);
					$(".redBorder").css("width",presetClass.oldMap.width);
					$(".redBorder").css("height",presetClass.oldMap.height);
				}
				el=null;
			}
			leftObject = null;
		}
	});
}
	function doMove(event){
		event=event||window.event;
		var el,  str ;
		el = getReal(event.srcElement ? event.srcElement : event.target);
		if(el.className =="encoderDiv redBorder resizeMe"||(leftObject!=null&&leftObject.objName)){
			if (el && el.className == "encoderDiv redBorder resizeMe"||(leftObject!=null&&leftObject.objName)) {				
				str = getDirection(el, event);
				//Fix the cursor 
				if (str == "") str = "default";
				else str += "-resize";
				try{ el.style.cursor = str;}catch(e){}
			}
		}
	}
	document.onmousemove = doMove;
//全局
FrameEvents.on(document, "touch", allTouchs, collectTouches);
// 左边列表拖拽
FrameEvents.on(leftDiv, "touch", leftTouchs, collectTouches);
FrameEvents.on(leftDiv, "drag", leftDrag, collectTouches);
FrameEvents.on(leftDiv, "release", leftRelease, collectTouches);
//右边画面拖拽和改变大小
 FrameEvents.on(rightDiv, "touch", rightTouchs, collectTouches);
FrameEvents.on(rightDiv, "drag", rightDrag, collectTouches);
FrameEvents.on(rightDiv, "release", rightRelease, collectTouches);
 