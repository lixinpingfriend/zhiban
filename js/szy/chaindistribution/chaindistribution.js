(function() {
	var $P = function (){
		return new $P.fn.init();
	},
	$P_init = null;
	$P.fn = $P.prototype;
	$P_init = $P.fn.init = function() {
		var obthis = this;
		this.markers = new Array();
		this.mapObj = new AMap.Map("iCenter");
		/*在地图中添加ToolBar插件*/
		this.mapObj.plugin(["AMap.ToolBar"],function(){
			var toolBar = new AMap.ToolBar();
			this.mapObj.addControl(toolBar);
		});
		/* 实例化点标记 */
		this.addMarker = function (lngx, laty, _content){
			var obthis = this;
			marker = new AMap.Marker({
				icon:"http://webapi.amap.com/images/marker_sprite.png",
				position:new AMap.LngLat(lngx,laty)
			});
			for(m in obthis.markers){
				try{
					obthis.markers[m].setMap(null);
				}catch(e){
				}
			}
			obthis.markers.push(marker);
			marker.setMap(obthis.mapObj);  /*在地图上添加点*/
			/* 信息泡泡 */
			var infoWindow = new AMap.InfoWindow({
				content: _content,
				autoMove: true,
				offset: {x:0,y:-30}
			});
			AMap.event.addListener(marker,"click",function(e){
				infoWindow.open(obthis.mapObj,marker.getPosition());
			});
			infoWindow.open(obthis.mapObj,marker.getPosition());
			obthis.mapObj.setFitView();	/* 自适应窗口 */
		};
		$Search({
			datagrid : "datagrid",
			formId : "searchForm",
			button: "search_btn",
			success : function() {
				$("tr[name='store_row']").on("click",function(e){
					var _position = $(this).attr("coordinate");
					var _content = "<span><h5>"+$(this).attr("org_name")+"</h5><p>地址："+$(this).attr("address")+"</p><p>电话："+$(this).attr("contact_phone")+"</p><p>联系人："+$(this).attr("contacts")+"</p></span>";
					if("" != _position){
						_position = _position.replace("{","").replace("}","");
						var tmp = _position.split(",");
						obthis.addMarker(tmp[0], tmp[1], _content);
					}else{
						this.mapObj.setCity("010");
					}
				});
			}
		}).initSearchBtn().searchData(1);
	};
	$P_init.prototype = $P.fn;
	window["szy"]["ChainDistribution"] = $P;
})();
function chain_init(){
	szy.ChainDistribution();
};
