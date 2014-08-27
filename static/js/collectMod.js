var collectID =0;
$(document).ready(function() {
	 collectID = getRequest("modCollect");
	// 显示收藏归档
	viewCollectGroupByMonth();
	$(".closeButton").click(function() {
		window.location.href = 'collect.html?firstColuId=12';
	});
	$("#collectContent").cleditor();//编辑器启动collect.html?firstColuId=12
	$.post(
			'../../handler/collect/getOneCollect',
			{
				"collectId":collectID
			},
			function(data) {
				var collect = data.data.data
				if(collect!=""&&collect!="null"&&collect!=null){
					var o = $("#collectContent").cleditor()[0];
					$("#collectContent").val(collect.collectDetail);
					o.updateFrame();
					var emotional = collect.collectPolarity;
					var cidnum = 0;
					if (emotional == "稍微正面") {
						cidnum = 1;
					}
					if (emotional == "稍微负面") {
						cidnum = 2;
					}
					if (emotional == "比较正面") {
						cidnum = 3;
					}
					if (emotional == "比较负面") {
						cidnum = 4;
					}
					var $opts = $("#emotionalTendencies option");
					for ( var i = 0; i < $opts.length; i++) {
						if ($($opts[i]).attr("value") == cidnum) {
							$($opts[i]).attr("selected", "selected");
						}
					}
				}
			}, "json");
	$("#modCollectButton").click(function() {
		modColledtDetial();
	});
});



//修改收藏信息
function modColledtDetial() {
	var collectContent = $("#collectContent").val();
	var emotionalTendencies = $("#emotionalTendencies").val();
	var emotionalTendencieDEt = "中性";
	if (emotionalTendencies == 1) {
		emotionalTendencieDEt = "稍微正面";
	}
	if (emotionalTendencies == 2) {
		emotionalTendencieDEt = "稍微负面";
	}
	if (emotionalTendencies == 3) {
		emotionalTendencieDEt = "比较正面";
	}
	if (emotionalTendencies == 4) {
		emotionalTendencieDEt = "比较负面";
	}
	$.post('../../handler/collect/modCollect', {
		"collectId" : collectID,
		"collectDetail" : collectContent,
		"collectPolarity" : emotionalTendencieDEt,
		"collectFlag" : 1
	}, function(data) {
		if (data.ret) {
			infoNotice("success", "", "修改成功!");
			window.location.href = 'collect.html?firstColuId=12';
		} else {
			infoNotice("error", "", data.errmsg);
		}
	}, "json");
}
//显示收藏归档
function viewCollectGroupByMonth() {
	$.post(
			'../../handler/collect/collectGroupByMonth',
			{},
			function(data) {
				if (data.ret) {
					var tableContent = "";
					if (data.data.result.length == 0) {
						tableContent = "<tr><td colspan=\"1\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i><strong>没有收藏</strong></td></tr>";
					} else {
						$.each(data.data.result, function(itemIndex, item) {
							collectDate = item.collectDateStr;
							var content = [];
							content = item.collectDateStr.split("-");
							for ( var i = 0; i < content.length; i++) {
								collectDateStrYear = content[0];
								collectDateStrMonth = content[1];
							}
							tableContent += "<tr>" + "<td><a href='#' id='" + collectDate
							+ "' data-toggle='modal' onclick='searchByCollect(this)'>" + content[0]
							+ "年" + content[1] + "月" + "     (" + item.count + ")" + "</a></td>"
							+ "</tr>";
						});
					}
					$('#viewCollectGroupByMonth').empty().append(tableContent);
				} else {
					infoNotice("error", "", data.errmsg);
				}
			}, "json");
}
//根据月份查看收藏内容
function searchByCollect(obj) {
	alert("请返回收藏首页查看");
}