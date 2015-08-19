
/*
*页面跳转，flag表示url是否加密，默认为false
*/
function gotoPage(url){
	if(url==undefined || url=="") return;
	var hash = $Base64.encode(url);
	window.location.hash = "#"+hash;
}
function loadDivPage(id,url,flag){
	if(url==undefined || url=="") return;
	if(flag == undefined){
		flag = true;
	}
	var hash = flag?url:$Base64.encode(url);
	if(hash.indexOf("?")>-1){
		hash=hash.substring(0,hash.indexOf("?"));
	}
	var tabObj = $("#menuTab a[href=\"#"+hash+"\"]");
	if(tabObj.length > 0){
		$(".menu_on").removeClass("menu_on");
		tabObj.addClass("menu_on");
	}
	ajaxLoad($("#"+id), contextPath+(url),function(){
		/**
		* 页面初始化时给必填字段初始化
		*/
		$("#"+id+" label.required").each(function(){
			if($(this).find(".red").length == 0){
				$(this).append("<span class='red'>*</span>");
			}
		});
		//radio样式
		$('#'+id+' input[type=radio]').iCheck({
			   radioClass: 'iradio_square-blue',
			   increaseArea: '20%'
		});
		 //checkbox样式
		$('#'+id+' input[type=checkbox]').iCheck({
				checkboxClass: 'icheckbox_square-blue',
				increaseArea: '20%'
		});
		$("#"+id+" .col_main_body_title.backtop").prepend($("<button>").addClass("btn btn-default pull-left btn-goto-back").html("<span class='glyphicon glyphicon-arrow-left'></span>"));
		$("#"+id+" .btn-goto-back").css("margin-top", "0px").on("click",function(){
			gotoBack();
		});
		/*if($HomeHash != hash){
		}*/
	});
}
/*
*页面返回
*/
function gotoBack(){
	window.history.back();
}
function loadMenu(){
	var url=contextPath+"/action/ccms/home/menu";
	ajaxCall(url,{
		method: "GET",
		progress: true,
		dataType: "json",
		success: function(data) {
			//var tenantry=data["tenantry"];
			//$("#home_tenantry_name").html(tenantry);
			var menuArray=data["data"];
			menuArray.pop();
			//$("#menuTab").empty();
			if($Mobile.any()){
				
			}else{
				$(".home_head").show();
				$(".home_col_side").show();
				$(".home_mod-footer").show();
				$(".home_main_body").css("top","80px");
				$(".home_main_body").css("bottom","30px");
				$(".home_container_box").css("padding-right","20px");
				/*for(var i=0;i<menuArray.length;i++){
					var obj=menuArray[i];
					var pid=obj.pid;
					var title=obj.title;
					var id=obj.id;
					var html='<li class="home_menu" style="clear:both;text-align:center" ><a class="menu_title">'+title+'<i class="icon_menu glyphicon glyphicon-chevron-down" ></i></a><ul style="display:none" class="child_menu" id="childMenu'+i+'"><ul></li>';
					if(pid==0){
						$("#menuTab").append(html);
						for(var j=0;j<menuArray.length;j++){
							var obj2=menuArray[j];
							var pid2=obj2.pid;
							var title2=obj2.title;
							var path=$Base64.encode(obj2.path);
							var logopath=obj2.logopath;
							if(id==pid2){
								var imagehtml='';
								if(logopath!=''){
									imagehtml='<img src="'+logopath+'" class="logoimg" />';
								}else{
									imagehtml='';
								}
								var html2='<li class="menu"><a href="#'+path+'" class="cmenu_title">'+imagehtml+title2+'</a></li>';
								$("#childMenu"+i).append(html2);
							}
						}
					}
				}*/
				$(".menu_title").click(function(){
					var imgobj=$(this).find("img.icon_t");
					var imgurl=imgobj.attr("src");
					if($(this).find("i").hasClass("glyphicon-chevron-up")){
						$(this).next().css("height","auto");
						var obj=$(this).next();
						$(this).next().animate({
							    height:'0'
						 },1000,function(){
							 obj.hide();
						 });
						$(this).find("i").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
						imgurl=imgurl.replace("_select","");
						imgobj.attr("src",imgurl);
					}else{
						$(".child_menu").hide();
						$("#menuTab").find(".glyphicon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
						$(this).next().show();
						var autoHeight = $(this).next().css('height', 'auto').height();
						$(this).next().css("height",0);
						var nobj=$(this).next();
						$(this).next().animate({
							    height:autoHeight
						 },1000,function(){
							 nobj.css("height","auto");
						 });
						$(this).find("i").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
						imgurl=imgurl.replace("_select","");
						imgurl=imgurl.replace(".png","_select.png");
						imgobj.attr("src",imgurl);
						var selecturl=$("a.menu_title.select").find("img").attr("src");
						if(selecturl!=undefined){
							selecturl=selecturl.replace("_select","");
							$("a.menu_title.select").find("img").attr("src",selecturl);
						}
					}
					$(".menu_title").removeClass("select");
					$(this).addClass("select");
				});
				$(".child_menu a").click(function (e) {
					$(".child_menu a").removeClass("select");
					$(this).addClass("select");
					e.preventDefault();
					if(e.target.hash != undefined){
						window.location.hash = e.target.hash;
					}
				});
			}
		}
	});
}

Date.prototype.getWeek = function()  
{   
    var myDate= this;  
    var str;
    var Week = ['日','一','二','三','四','五','六'];  
    str= ' 星期' + Week[myDate.getDay()];  
    return str;  
}  

function getSysDate(){
    getCurrentDate();
}

var currentDate='';
function  getCurrentDate(){
	var url="/action/project/getCurrentDate";
	$Util.postData(url,{method:"post",dataType:"json",success:function(data){
		var result=data.result;
		var dot=result.indexOf(".");
		result=result.substring(0,dot);
		var nowDate=$Util.toDate(result);
		var weekdate=nowDate.getWeek(true);
		$("#week_div").html(weekdate);
		var hour=nowDate.getHours();     
	    var minute=nowDate.getMinutes()+'';  
	    if(minute.length==1){
	    	minute='0'+minute;
	    }
	    var hourstr=hour+":"+minute;
	    $("#datemins").html(hourstr);
	    var year=nowDate.getFullYear();
	    var month=nowDate.getMonth()+1;
	    var day=nowDate.getDate();
	    var datestr=year+"-"+month+"-"+day;
	    var curstr=year;
	    if((month+'').length==1){
	    	curstr=curstr+"-0"+month;
	    }else{
	    	curstr=curstr+"-"+month;
	    }
	    if((day+'').length==1){
	    	curstr=curstr+"-0"+day;
	    }else{
	    	curstr=curstr+"-"+day;
	    }
	    currentDate=curstr;
	    $("#datetimesec").html(curstr);
	    window.setTimeout(function(){
	    	getSysDate();
	    },1000*60);
	    
	}});
}

function  getNow(){
	return currentDate;
}


function  getNowDate(){//当前时间
	var nowDate;
	var url="/action/project/getCurrentDate";
	$Util.postData(url,{method:"post",dataType:"json",async:false,success:function(data){
		var result=data.result;
		var dot=result.indexOf(".");
		result=result.substring(0,dot);
		nowDate=$Util.toDate(result);
	}});
	return nowDate;
}


function  searchJieRemind(){
	var url="/action/project/dutyjoin/searchJieRemind";
	$Util.postData(url,{method:"post",dataType:"json",success:function(data){
		var result=data.result;
		var num=parseInt(result);
		
		var aurl="/action/project/dutyjoin/crud";
		var tabObj = $("#menuTab a[href=\"#"+aurl+"\"]");
		if(num>0){
			var imgurl=contextPath+"/images/project/gantanhao.png";
			var imgstr="<img src='"+imgurl+"' />";
			var html="<div class=remind title='改接班了'>"+imgstr+"</div>";
			tabObj.parent().append(html);
		}
	}});
}

//定义首界面hash
var $HomeHash = "";
$(document).ready(function() {
	//判断是否是微信登陆 
	loadMenu();
	getSysDate();
	searchJieRemind();
});

$(window).on("hashchange",function(){
	var hash = window.location.hash;
	var actionroot=$("#home_actionroot").val();
	if(hash == ""){
		loadDivPage("body_content","/action/project/dutyplan/crud");
	}else if (hash.match("#")) {
		var h = hash.split("#")[1];
		if($HomeHash == ""){
			$HomeHash = h;
		}
		if(h.indexOf("a_") < 0){
			loadDivPage("body_content",h,true);
		}
	}
});
$(function(){ $(window).trigger("hashchange");});



