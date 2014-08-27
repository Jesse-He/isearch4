$(document).ready(function() {
	$.ajaxSettings.async = false;
	leftColumShow(6);
	var coluId = getRequest("secondColuId");
	var parentColuId = getRequest("firstColuId");
	$("#topMenu").find('li').each(function() {
		$(this).removeClass();
	});
	$("#coluId" + coluId + "").attr("class", "active"); // 添加菜单选中样式
	$("#firstColuId" + parentColuId + "").attr("class", "active"); // 添加菜单选中样式
	backToTop();// back To Top
	loadPage();
	$("#checkNewTime").click(function(){
		var chils = document.getElementsByClassName("tdcenter");
		var type = document.getElementsByClassName("engineParam");
		var ids="";
		var webTypes = "";
		if(chils.length-1==type.length){
			for(var i =1; i<chils.length;i++){
				//alert("!~"+type[i-1].innerHTML);
					if(chils[i].getAttribute('id')==type[i-1].getAttribute('enginetype')){
						if(i==1){
							ids += chils[i].getAttribute('id');
							webTypes += type[i-1].innerHTML;
						}
						if(i>1){
							ids +=";"+chils[i].getAttribute('id');
							webTypes += ";"+ type[i-1].innerHTML;
						}
					}else{
						alert("error");
					}
				}
			$.post('../../handler/metasearch/queNewTimeMetaSearch',
					{
				"ids":ids,
				"webTypes":webTypes
					},
					function(data) {
						var getdata = data.data.data;
						var num= "0";
						$.each(getdata, function(entryIndex, entry) {
							$("#selectNewTime"+entryIndex+"").empty().html(entry);
						});
					}, "json");
		}
	
	
	});
});
//跳转时页面的响应
function modTurnPage(mateID){
	window.location.href="EngineparametersMod.html?mateid="+mateID+"";
}
//初始加载页面
function loadPage() {
	$.ajaxSettings.async = false;
	var fpage = "<div class='well'><div><table class=\"table table-striped table-bordered\" id=\"dataArea\">"
		+ "<thead><tr><th>序</th><th class=\"tdcenter\" id='"+""+"'>引擎名称 </th><th>引擎类型</th><th>引擎最近报告时间</th></tr></thead><tbody id='getmate'></tbody>"
		+ "</table></div></div>";
	$("#engineParamData").empty().append(fpage);
	var startIndex=1;
	var flag = 0;
	$.post('../../handler/metasearch/queHotMetaSearch',
			{},
			function(data) {
				if (data.ret) {
					var result = data.data.data;
					$.each(result, function(entryIndex, entry) {
						var rowhtml = "<tr><td class=\"tdcenter\" id='"+entry.metaId+"'>" + startIndex + "</td>"
						+ "<td><a herf='#' style='cursor:pointer;' onClick='modTurnPage("+entry.metaId+");'>"+entry.metaName+"</a></td><td enginetype=\""+entry.metaId+"\" class='engineParam'>"+entry.cate+"</td>";
						rowhtml += "<td id='selectNewTime"+flag+"'>点击查看当前引擎数据</td></tr>";
						$('#getmate').append(rowhtml);
						flag = flag+1;
						startIndex = startIndex+1;
					});
				} else {
					infoNotice("error", "", data.errmsg);
				}
			}, "json");

}
