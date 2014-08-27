var metaSearch = "";//
var attentionLevel = "";// 
var topic = "";// 
var sentiment = "";// 
var days = "";// 查询的天数。0表示选择的是时间段
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var params = {};// 请求的参数
var recentDays = "";
var viewaction = ""
var modCollectId = 0;// 修改单个收藏内容的id
var isNotEdit = -1;//页面显示的编辑情况
$(document).ready(function() {
	backToTop();// back To Top
	paginationPage();// 键入页码，分页等标识
	loadPage();
	var isNotEdit= $("#chooseEdit").val();
	params = {
		"pageArray" : new Array(),
		"recordPerPage" : 10,
	    "chooseEdit": isNotEdit
	};
	viewaction = '../../handler/collect/queryByCollect';
	// 显示收藏归档
	viewCollectGroupByMonth();
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	// 绑定搜索按钮
	bindSearch();
	checkbyvalue(fristPage);// 初始化页码
	$(".edit").click(function() {
		modCollectId = $(this).parent().parent().find(".dataCheckbox").attr("value");
		var modId = "?modCollect="+modCollectId;
		window.location.href = 'collectMod.html'+modId;
	});
});


// 显示收藏归档
function viewCollectGroupByMonth() {
	$.post('../../handler/collect/collectGroupByMonth',
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
// 根据月份查看收藏内容
function searchByCollect(obj) {
	var collectDate = obj.id + "-01" + " 00:00:00";
	params = {
		"pageArray" : new Array(),
		"recordPerPage" : 10,
		"collectDate" : collectDate
	};
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	$(".edit").click(function() {
		modCollectId = $(this).parent().parent().find(".dataCheckbox").attr("value");
		var modId = "?modCollect="+modCollectId;
		window.location.href = 'collectMod.html'+modId;
	});
}
// 初始加载页面
function loadPage() {
	$.ajaxSettings.async = false;
	var fpage = "<h3 id='title' class='page-header'>收藏舆情</h3>"
			+ "<div class='buttonGroup'>"
			+ "<input id='keyword' class='input-small search-query' type='text' placeholder='请输入关键字...' />&nbsp;&nbsp;"
			+ "<input  class='span2' id='startTime' data-date-format='yyyy-mm-dd' class='input-medium time' placeholder='开始收藏时间...' type='email' data-provide='typeahead'>~<input class='span2' id='endTime' data-date-format='yyyy-mm-dd' class='input-medium' placeholder='结束收藏时间...' type='email' data-provide='typeahead'>&nbsp;&nbsp;"
			+" <select class='span2' id='chooseEdit' onchange='checkisEdit(this.value);'><option value=\"-1\">显示全部</option><option value=\"0\">未编辑</option><option value=\"1\">已编辑</option></select>&nbsp;&nbsp;"
			+ "<a class='btn btn-info'style='cursor: pointer;' id='search'><i class='icon-zoom-in icon-white'></i>查询</a>&nbsp;&nbsp;"
			+ "<a id='printContent' onclick=\"javascript:printCollectPaper();\"  type='button' class='btn btn-success'><i class=' icon-print icon-white'></i>打印</a>&nbsp;&nbsp;"
			+ "<a onclick=\"javascript:deleteCollect();\"><button id=\"delete\"  type=\"submit\" class=\"btn btn-danger\"><i class=\"icon-minus icon-white\"></i>删除</button></a>"
			+ "</div>"
			+ "<div id='print' class='well'><div><table class=\"table table-striped table-bordered\" id=\"dataArea\">"
			+ "<thead><tr><th>序</th><th><input type='checkbox' id='chooseAll' onclick=\"javascript:clickAll();\"></th><th class=\"tdcenter\" >新闻标题</th><th>媒体类型</th><th>采集站点</th><th>收藏时间</th><th>情感倾向</th><th>编辑状况</th></tr></thead><tbody></tbody>"
			+ "</table></div></div>";
	$("#abstactData").empty().append(fpage);
	// 绑定时间选择
	timepicker("startTime");
	timepicker("endTime");
}

function checkisEdit(v){
	isNotEdit = v;	
	bindSearch(); 
}

// 打印
function printCollectPaper() {
	// 获取选择的id序列
	var ids = new Array();
	$('input[name="chooseWeb"]').each(function() {
		var $current = $(this);
		if ($current.attr('checked') != undefined)
			ids.push($current.val());
	});
	// 如果选择的id为空，则提示错误信息
	if (ids.length == 0) {
		confirm("请先选择需要打印的收藏内容！");
	} else {// 否则，向后台发送请求并显示结果信息
		var url = '../../handler/collect/queryCollectById';
		var content = "";
		$.post(url, {
			"ids" : ids.toString()
		}, function(data) {
			if (data.ret) {
				$.each(data.data.result, function(entryIndex, entry) {
					var sentimentColor = "#0033FF";
					if (entry.collectPolarity.indexOf("正面") >= 0)
						sentimentColor = "#009966";
					else if (entry.collectPolarity.indexOf("负面") >= 0)
						sentimentColor = "#CC3399";
					content += "<div style='text-align:left;'><div><ul style=\"list-style-type:none\" >"
							+ "<li><strong>" + entry.collectTitle
							+ "</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>" + entry.collectSite
							+ " </strong>" + entry.collectPubDateStr
							+ "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: " + sentimentColor + "'>"
							+ entry.collectPolarity + "</span>]</li>" + "<li class=''><strong>[摘要]</strong>: "
							+ entry.collectContent + "</li>"
					if (entry.collectFlag == 1) {
						content += "<li class=''><strong>[详细]:</strong>" + entry.collectDetail + "</li>"
					}
					content += "<li class=''>主题：<a><strong>" + entry.collectTopic
							+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							+ "[关注度: <span style='color: #FF9900'><strong>" + entry.collectAttentionLevel
							+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于"
							+ entry.collectCrawlDateStr + "  采自<strong>" + entry.collectSite
							+ "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于 " + entry.collectDateStr + " 收藏]"
							+ "</li></ul></div></div>";
				});
			} else {
				infoNotice("error", "", data.errmsg);
			}
		}, "json");
		OpenWindow = window.open();
		OpenWindow.document.write("<html>");
		OpenWindow.document.write("<title>打印收藏舆情</title>");
		OpenWindow.document.write("<body><div align=\"center\"><h2>收藏舆情</h2></div>");
		OpenWindow.document.write("<div id=\"printDetailReport\" align=\"center\" class=\"container-fluid\">");
		OpenWindow.document.write("<table id='dataArea'"
				+ "class='table table-hover table-striped table-condensed'><thead></thead><tbody>" + content
				+ "</tbody></table></div>");
		OpenWindow.document
				.write("<div id=\"p\" align=\"center\"><a class=\"printP\"  href=\"javascript:window.print()\">打印</a></div>");
		OpenWindow.document.write("</body>");
		OpenWindow.document.write("</html");
		OpenWindow.document.close();
	}
}

// 删除
function deleteCollect() {
	// 获取选择的id序列
	var ids = new Array();
	$('input[name="chooseWeb"]').each(function() {
		var $current = $(this);
		if ($current.attr('checked') != undefined)
			ids.push($current.val());
	});
	// 如果选择的id为空，则提示错误信息
	if (ids.length == 0) {
		confirm("请先选择删除内容！");
	}
	// 否则，向后台发送删除请求并显示结果信息
	else {
		if (confirm("请确认是否删除！")) {
			$.post("../../handler/collect/deleteCollect", {
				"ids" : ids.toString()
			}, function(data) {
				if (data.ret) {
					infoNotice("success", "", "删除成功!");
					window.location.reload();
				} else {
					infoNotice("error", "", data.errmsg);
				}
			}, "json");
		}
	}
}
// 全选
function clickAll() {
	if ($('#chooseAll').attr("checked")) {
		$('input[name="chooseWeb"]').iCheck('check');
	} else {
		$('input[name="chooseWeb"]').iCheck('uncheck');
	}
}
function bindSearch() {
	$('#search').click(function() {
		getParams();
		initialBind();// 绑定分页的一些操作响应
		initSearch();
		$(".edit").click(function() {
			modCollectId = $(this).parent().parent().find(".dataCheckbox").attr("value");
			var modId = "?modCollect="+modCollectId;
			window.location.href = 'collectMod.html'+modId;
		});
		return false;
	});
}
function getParams() {
	// 点击搜索，一切重新查找
	var startTime = $("#startTime").val() + ":00";
	var endTime = $("#endTime").val() + ":00";
	params.searchWord = $('#keyword').val();
	params.chooseEdit = isNotEdit;
	if (startTime > endTime) {
		alert("收藏开始时间不能晚于收藏结束时间");
		return;
	}
	if (startTime != ":00" && endTime != ":00") {
		params.startTime = startTime;
		params.endTime = endTime;
	}

}
// 加载页面内容
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	var $records = $('#dataArea').children('tbody');
	$records.empty();
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	if (pageRecords.data.length == 0) {
		$records
				.append("<tr><td colspan=\"10\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i>  没有相关数据！</td></tr>");
	} else {
		var titelDetail = "暂无收藏细节";
		$.each(pageRecords.data, function(entryIndex, entry) {
			var flag = "";
			if (entry.collectFlag == 0) {
				flag = "未编辑";
			} else {
				flag = "已编辑";
			}
			if (entry.collectDetail == "" || entry.collectDetail == undefined) {
				entry.collectDetail = "";
				titelDetail = "暂无编辑信息";
			} else {
				titelDetail = entry.collectDetail;
			}
			var rowhtml = "<tr><td class=\"tdcenter\">" + startIndex + "</td>"
					+ "<td><input class='dataCheckbox' type='checkbox' name='chooseWeb' value='" + entry.collectId
					+ "'></td><td><a target='_blank' name='title' data-placement='top' data-original-title='"
					+ titelDetail + "' href=\"" + entry.collectUrl + "\" id='" + entry.collectId + "' >"
					+ titleFormat(entry.collectTitle, 22) + "</a></td><td>" + entry.collectType + "</td><td>"
					+ entry.collectSite + "</td>" + "<td class=\"tdcenter\" title=\"" + entry.collectDateStr
					+ "\"><a name='title' href='#'  data-placement='top' data-original-title='" + "采集时间："
					+ entry.collectCrawlDateStr + "</br>" + "发布时间:" + entry.collectPubDateStr + "'>"
					+ entry.collectDateStr + "</a></td><td  class=\"tdcenter emotion\">" + entry.collectPolarity
					+ "</td><td class=\"isEdit tdcenter\" type='Edit' name = '" + entry.collectDetail + "'><a class='edit' style='cursor:pointer;'>" + flag + "</a></td>";
			rowhtml += "</tr>";
			$records.append(rowhtml);
			// 鼠标悬停后弹出内容
			$("[name=title]").popover({
				trigger : 'hover',
				container : 'body',
				html : 'true',
			});
			startIndex = startIndex + 1;
		});
	}
}
