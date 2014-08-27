var metaSearch = "";//
var attentionLevel = "";// 
var topic = "";// 
var sentiment = "";// 
var days = "";// 查询的天数。0表示选择的是时间段
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var params;// 请求的参数
var flag = 0;
var recentDays = "";
$(document).ready(function() {
	backToTop();// back To Top
	// 加载二级目录
	loadColumn();
	var nowDate = new Date();
	endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
	+ nowDate.toLocaleTimeString();
	days = 1;
	var beginDate = new Date();
	var beforDate = nowDate.getTime() - 0 * 24 * 60 * 60 * 1000;
	beginDate.setTime(beforDate);
	startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-"
	+ beginDate.getDate() + " 00:00:00";
	recentDays = 1;
	params = {
			"recentDays" : recentDays,
			"startTime" : startTime,
			"endTime" : endTime,
			"topNum" : 10
	};
	systemGetPaper1();
	viewaction = '../../handler/epoquery/query';
	params = {
			"recentDays" : 1,
			"pageArray" : new Array(),
			"recordPerPage" : 10
	};
	paginationPage();// 键入页码，分页等标识
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	// 绑定搜索按钮
	bindSearch();

});
function printSystemPaper() {
	var todaydata = $("#todayReport").html();
	var chart = $("#todayChart").html();
	var url = '../../handler/epoquery/query';
	var content = "";
	$.post(url, {
		"recentDays" : 1
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			for (i in resultData) {
				$.each(resultData[i].data, function(entryIndex, entry) {
					var sentimentColor = "#0033FF";
					if (entry.sentiment.indexOf("正面") >= 0)
						sentimentColor = "#009966";
					else if (entry.sentiment.indexOf("负面") >= 0)
						sentimentColor = "#CC3399";
					content += "<ul class='page-header' style=\"list-style-type:none\" id=" + entry.id + ">"
					+ "<li><a class='titleEpo' target='_blank' href='" + entry.url
					+ "'><i class='icon-tag'></i>" + entry.title + "</a>"
					+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>" + entry.originalSource + " </strong>"
					+ entry.pubTime + "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: "
					+ sentimentColor + "'>" + entry.sentiment + "</span>]</li>"
					+ "<li class=''><strong>[摘要]</strong>: " + entry.summerize + "</li>"
					+ "<li class=''>主题：<a><strong>" + entry.topic
					+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
					+ "[关注度: <span style='color: #FF9900'><strong>" + entry.attentionLevel
					+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于" + entry.crawlTime
					+ "采自<strong>" + entry.source + "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ul>"
				});
			}
		} else {
			content += "没有相关数据";
		}
	});
	OpenWindow = window.open();
	OpenWindow.document.write("<html>");
	OpenWindow.document.write("<title>打印页面</title>");
	OpenWindow.document
	.write("<body><div align=\"center\"><h3>系统自动简报</h3></div><h4 class=\"page-header\">今日舆情数据报告</h4>");
	OpenWindow.document.write("<div id=\"printReport\">" + todaydata
			+ "</div><h4 class=\"page-header\">今日舆情统计图</h4><div id=\"printChart\">" + chart
			+ "</div><h4 class=\"page-header\">今日舆情详细数据</h4><div id=\"printDetailReport\" class=\"container-fluid\">");
	OpenWindow.document.write("<div class=\"well\" id=\"dataArea\">" + content + "</div>");
	OpenWindow.document
	.write("<div id=\"p\" align=\"center\"><a class=\"printP\" style='cursor:pointer;' href=\"javascript:window.print()\">打印</a></div>");
	OpenWindow.document.write("</body>");
	OpenWindow.document.write("</html");
	OpenWindow.document.close();
}
function systemGetPaper1() {
	var nowDate = new Date();
	endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
	+ nowDate.toLocaleTimeString();
	days = 1;
	var beginDate = new Date();
	var beforDate = nowDate.getTime() - 0 * 24 * 60 * 60 * 1000;
	beginDate.setTime(beforDate);
	startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-" + beginDate.getDate()
	+ " 00:00:00";
	recentDays = 1;
	params = {
			"recentDays" : recentDays,
			"startTime" : startTime,
			"endTime" : endTime,
			"topNum" : 10
	};
	systemGetPaper();
	timedistrDisplay();
	topicdistrDisplay();
	sitedistrDisplay();
	viewaction = '../../handler/epoquery/query';
	params = {
			"recentDays" : 1,
			"pageArray" : new Array(),
			"recordPerPage" : 10
	};
	flag = 2;
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	// 绑定搜索按钮
	bindSearch();
}

//自动获取简报
function systemGetPaper() {
	var content1 = "<div class=\"row-fluid\"><div  class=\"span12 well\"><h4>系统自动简报<a style='cursor:pointer;' onclick=\"javascript:printSystemPaper();\">(打印报告)</a></h4>"
		+ "<h4 id=\"title\" class=\"page-header\"></h4>"
		+ "<div id=\"todayReport\" style=\"height: 75px;\"></div><h4 class=\"page-header\">今日舆情统计图</h4><div id=\"todayChart\"><div id=\"time\"></div><div id=\"topic\"></div><div id=\"metasearch\"></div></div><h4 class=\"page-header\">今日舆情详细数据</h4><div id=\"topicDetailReport\" class=\"container-fluid\">"
		+ "<div class=\"row-fluid\"><div class=\"page-header\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>舆 情 摘 要</strong><span class=\"pull-right\">排序:<select id=\"listsort\""
		+ "class=\"selcombobox\" style=\"height: 25px; width: 100px;\" name=\"listsort\" onchange='javascript:SearchByOrder(this);'><option value=\"1\" selected=\"selected\">按情感值</option><option value=\"2\">按发表时间</option>"
		+ "<option value=\"3\">按采集时间</option><option value=\"4\">按热度</option><option value=\"5\">按相关度</option></select></span></div><div class=\"well\" id=\"dataArea\"></div>"

		// 页面开始
		+ "<div id=\"pagination\" class=\"btn-toolbar\"></div>" + "</div>" + "</div></div>";
	$("#abstactData").empty().append(content1);
	// 今日舆情数据报告
	OutlineDisplay();
	titlHtml();
}
function titlHtml(startTime, endTime) {
	var $title = $("#title");
	$title.empty();
	if (startTime != null && endTime != null) {
		var timeHtml = "从  <a><strong>" + startTime + "</strong></a>到  <a><strong>" + endTime
		+ "</strong></a>间 的舆情统计报表";
	} else {
		var timeHtml = "从  <a><strong>" + params.startTime + "</strong></a>到  <a><strong>" + params.endTime
		+ "</strong></a>间 的舆情统计报表";
	}
	$title.append(timeHtml);
}
//系统自动摘报的舆情数据报告
function OutlineDisplay() {
	var nowDate = new Date();
	endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
	+ nowDate.toLocaleTimeString();
	days = 1;
	var beginDate = new Date();
	var beforDate = nowDate.getTime() - 0 * 24 * 60 * 60 * 1000;
	beginDate.setTime(beforDate);
	startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-" + beginDate.getDate()
	+ " 00:00:00";
	var OutlineHtml = '';
	var url = '../../handler/epostat/statSum';
	$
	.post(
			url,
			{
				"recentDays" : recentDays
			},
			function(data) {
				if (data.data != null && data.data.statData != null) {
					var resultData = data.data.statData;
					OutlineHtml = /*
					 * "本报告的数据来自：从 <a><strong>" +
					 * startTime + "</strong></a>到 <a><strong>" +
					 * endTime + "</strong></a>日间</br>"+
					 */// 系统自动简报摘要
						"<ul class='read13'><li>更新内容网站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.updateTopicCount
						+ "个</li>"
						+ "<li>监测主题数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.topicCount
						+ "个</li>"
						+ "<li>采集网站数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.metaSearchCount
						+ "个</li></ul>"
						+ "<ul class='read23'><li>监测预警舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?warn=-6'><strong>"
						+ resultData.warningCount
						+ "</strong></a>条</li>"
						+ "<li>初判负面舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?sentiment=-1'><strong>"
						+ resultData.negCount
						+ "</strong></a></li>"
						+ "<li>监测舆情数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.totalCount
						+ "条</li></ul>"
						+ "<ul class='read33'><li>重点关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?attentionLevel=3'><strong>"
						+ resultData.attSpecialCount
						+ "</strong></a>条</li>"
						+ "<li>比较关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?attentionLevel=1'><strong>"
						+ resultData.attGeneralCount
						+ "</strong></a>条</li>"
						+ "<li>一般关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?sentiment=-1'><strong>"
						+ resultData.negCount + "</strong></a>条</li></ul>";
				} else
					OutlineHtml = "没有相关数据";
				$("#todayReport").html(OutlineHtml);
			});
}
function searchByid(obj) {
	loadPage();
	flag = 0;
	topic = obj.id;
	params = {
			"topic" : topic,
			"pageArray" : new Array(),
			"recordPerPage" : 10
	}
	viewaction = '../../handler/epoquery/query';
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	// 绑定搜索按钮
	bindSearch();
	// 将数据返回后的显示内容放到指定函数中，防止其它地方分页冲突
	// 绑定全选框
}
function clickAll() {
	if ($('#chooseAll').attr("checked")) {
		$('input[name="chooseWeb"]').iCheck('check');
	} else {
		$('input[name="chooseWeb"]').iCheck('uncheck');
	}
}
function bindSearch() {
	$('#search').click(function() {
		// 点击搜索，则是范围查询，用户id置为0
		userid = 0;
		getParams();
		initSearch();
		return false;
	});
}
function getParams() {
	// 点击搜索，一切重新查找
	params.keyword = $('#keyword').val();
}
function loadPage() {
	$.ajaxSettings.async = false;
	var fpage = "<div class=\"page-header\"><h4>监测主题舆情</h4></div><div id=\"searchForm\" class=\"form-inline\">"
		+ "<a style='cursor:pointer;' onclick=\"javascript:exportSelected();\"><button class=\"btn btn-primary\"><i class='icon-share-alt icon-white'></i>导出选中</button></a>&nbsp;&nbsp;"
		+ "<a style='cursor:pointer;' onclick=\"javascript:exportAll(topic);\"><button class=\"btn btn-primary\"><i class='icon-share-alt icon-white'></i>导出所有</button></a>&nbsp;&nbsp;"
		+ "<select id=\"searchText\" class=\"span2\" align=\"right\"><option value=\"0\">标题</option>"
		+ "<option value=\"1\">摘要信息</option></select>"
		+ "&nbsp;&nbsp;<input id=\"web-keyword\" class=\"span2\" placeholder=\"搜索关键词\" type=\"text\">&nbsp;&nbsp;<button id=\"web-search\" type=\"submit\" class=\"btn btn-primary\"><i class=\"icon-search icon-white\"></i>搜索</button>&nbsp;&nbsp;"
		if (role == 1) {
			fpage += "<a onclick=\"javascript:deleteAbstract();\"><button id=\"delete\"  type=\"submit\" class=\"btn btn-danger\"><i class=\"icon-minus icon-white\"></i>删除</button></a></div></br>"
		}
	fpage += "<table class=\"table table-striped table-bordered\" >"
		+ "<thead><tr><th>序</th><th><input type='checkbox' id='chooseAll' onclick=\"javascript:clickAll();\"></th><th class=\"tdcenter\" >新闻标题</th><th>媒体类型</th><th>采集站点</th><th>采集时间</th><th>发表时间</th><th>情感倾向</th></tr></thead><tbody id=\"dataArea\"></tbody>"
		+ "</table><div class=\"btn-toolbar\"><div class=\"btn-group\"><button class=\"btn\">当前第</button><button id=\"currentPage\" class=\"btn\"></button>"
		+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"totalPage\" class=\"btn\"></button>"
		+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button id=\"pagebackward\" class=\"btn\">上一页</button>"
		+ "<button id=\"pageforward\" class=\"btn\">下一页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"recordCount\" class=\"btn\"></button>"
		+ "<button class=\"btn\">条</button></div><div class=\"btn-group\"><button class=\"btn\">每页</button><select id=\"recordPage\" class=\"input-mini changePage\"><option>10</option>"
		+ "<option>20</option><option>30</option><option>40</option><option>50</option></select></div><div class=\"btn-group\">"
		+ "<button id=\"goto\" class=\"btn\">跳转</button><input id=\"gotopage\" type=\"text\" class=\"input-mini changePage\" placeholder=\"页码\"/></div></div>";
	$("#abstactData").empty().append(fpage);
	$("#web-search").click(function() {
		// 点击搜索，则是范围查询，用户id置为0
		var searchType = $("#searchText").val();
		var webkeyword = $("#web-keyword").val();
		viewaction = '../../handler/epoquery/query';
		params = {
				"topic" : topic,
				"searchType" : searchType,
				"searchWord" : webkeyword,
				"pageArray" : new Array(),
				"recordPerPage" : 10
		};
		flag = 0;
		// 绑定分页的一些操作响应
		initSearch();
		// 绑定搜索按钮
		bindSearch();
	});
}
//删除
function deleteAbstract() {
	if (confirm("请确认是否删除！")) {
		// 获取选择的id序列
		var ids = new Array();
		$('input[name="chooseWeb"]').each(function() {
			var $current = $(this);
			if ($current.attr('checked') != undefined)
				ids.push($current.val());
		});
		// 如果选择的id为空，则提示错误信息
		if (ids.length == 0) {
			confirm("请先选择需要删除的内容！");
		}
		// 否则，向后台发送删除请求并显示结果信息
		else {
			$.post("../../handler/epoquery/deleteWebPage", {
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
//导出选择的
function exportSelected() {
	var chooseWeb = new Array();
	chooseWeb.splice(0);
	$("input[name='chooseWeb']").each(function() {
		var $current = $(this);
		if ($current.attr('checked') != undefined)
			chooseWeb.push($current.val());
	});
	if (chooseWeb.length == 0) {
		confirm("请先选择需要导出的舆情！");
	} else {
		var url = "../../handler/webpage/exSelectWeb?filename=Webpage.xls";
		var urlparams = {
				"webids" : chooseWeb.toString()
		};
		url += "&" + $.param(urlparams, true);
		window.location.href = url;
	}
}
//导出所有
function exportAll(topic) {
	var url = "../../handler/webpage/exSelectAll?filename=Webpage.xls";
	var urlparams = {
			"topic" : topic
	};
	url += "&" + $.param(urlparams, true);
	window.location.href = url;
}
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	// var $records = $('#dataArea').children('tbody');
	// $records.empty();
	$("#dataArea").empty();
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	if (flag == 0) {
		if (pageRecords.data.length == 0) {
			$("#dataArea").append("<div class='titleEpo'>没有相关结果！</div>");
		} else {
			$.each(pageRecords.data, function(entryIndex, entry) {
				var rowhtml = "<tr><td class=\"tdcenter\">" + startIndex + "</td>"
				+ "<td><input type='checkbox' name='chooseWeb' value='" + entry.id
				+ "'></td><td><a target=\"_blank\" href=\"" + entry.url + "\" id='" + entry.id + "'  title=\""
				+ entry.title + "\">" + entry.title.substring(0, 25) + "</a></td><td>" + entry.source
				+ "</td><td>" + entry.source + "</td><td class=\"tdcenter\" title=\"" + entry.crawlTime + "\">"
				+ entry.crawlTime + "</td>" + "<td class=\"tdcenter\" title=\"" + entry.pubTime + "\">"
				+ entry.pubTime + "</td><td  class=\"tdcenter\">" + entry.sentiment + "</td>";
				rowhtml += "</tr>";
				$("#dataArea").append(rowhtml);
				startIndex = startIndex + 1;
			});
		}
	} else {
		if (pageRecords.data == null && pageRecords.data.pageData == null) {
			$("#topicDataArea").append(
			"<tr><td colspan=\"5\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i>  没有相关数据！</td></tr>");
		} else {
			var content = "";
			$.each(pageRecords.data, function(entryIndex, entry) {
				var sentimentColor = "#0033FF";
				if (entry.sentiment.indexOf("正面") >= 0)
					sentimentColor = "#009966";
				else if (entry.sentiment.indexOf("负面") >= 0)
					sentimentColor = "#CC3399";
				entry.title = titleFormat(entry.title, 25); // 缩减过长的标题
				var rowhtml = "<ul class='page-header' style=\"list-style-type:none\" id=" + entry.id + ">"
				+ "<li><a class='titleEpo' target='_blank' href='" + entry.url + "'><i class='icon-tag'></i>"
				+ entry.title + "</a>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>" + entry.originalSource
				+ " </strong>" + entry.pubTime
				+ "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: " + sentimentColor + "'>"
				+ entry.sentiment + "</span>]</li>" + "<li class=''><strong>[摘要]</strong>: " + entry.summerize
				+ "</li>" + "<li class=''>主题：<a><strong>" + entry.topic
				+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
				+ "[关注度: <span style='color: #FF9900'><strong>" + entry.attentionLevel
				+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于" + entry.crawlTime
				+ "采自<strong>" + entry.source + "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
				$("#dataArea").append(rowhtml);
				startIndex = startIndex + 1;
			});
			$("#topicDataArea").append(content);
		}
		$('#chooseall').text("全选");
	}
}// 数据显示完
function loadColumn() {
	url = "../../handler/column/viewAllTopic";
	var colunmHtml = "";
	var opinionInfoHtml = "";
	$
	.post(
			url,
			{
				"type" : 1
			},
			function(data) {
				if (data.data != null && data.data.topicData != null) {
					var topicData = data.data.topicData;
					var i = 1;
					colunmHtml += "<div class='accordion-body in collapse' id='accordion-element-1'>";
					opinionInfoHtml += "<div class='accordion-body in collapse' id='accordion-element-2'>";
					$
					.each(
							topicData,
							function(entrtIndex, entry) {
								if (entry.topicCat != null) {
									colunmHtml += "<div class='accordion-heading'><a class='accordion-toggle' data-parent='accordion-1' data-toggle='collapse' href='#accordion-element-1"
										+ i
										+ "'>&nbsp;<i class='icon-tags'></i>"
										+ entry.topicCat
										+ "</a></div>";
									opinionInfoHtml += "<div class='accordion-heading'><a class='accordion-toggle' data-parent='accordion-1' data-toggle='collapse' href='#accordion-element-2"
										+ i
										+ "'>&nbsp;<i class='icon-tags'></i>"
										+ entry.topicCat
										+ "</a></div>";
									if (entry.topicList != null) {
										colunmHtml += "<div class='accordion-body collapse' id='accordion-element-1"
											+ i + "'>";
										opinionInfoHtml += "<div class='accordion-body collapse' id='accordion-element-2"
											+ i + "'>";
										$
										.each(
												entry.topicList,
												function(subEntrtIndex, subEntry) {
													colunmHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-star'></i>"
														+ "<a href='#' id='"
														+ subEntry.topicId
														+ "' onclick='javascript:paperDisplayById(this);''>"
														+ subEntry.topicName + "</a></br>";
													opinionInfoHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-star'></i>"
														+ "<a href='#' id='"
														+ subEntry.topicId
														+ "' onclick='javascript:searchByid(this);''>"
														+ subEntry.topicName + "</a></br>";
												});
										colunmHtml += "</div>";
										opinionInfoHtml += "</div>";
									}
								}
								i++;
							});
					colunmHtml += "</div>";
					opinionInfoHtml += "</div>";
				}
				$("#brief").append(colunmHtml);
				$("#opinionInfo").append(opinionInfoHtml);
			});
}
function printPaperById(obj) {
	var topic = obj.id;
	var topicName = obj.name;
	var todaydata = $("#dataReport").html();
	// var chart = $("#topicSummary").html();
	var url = '../../handler/epoquery/query';
	var content = "";
	$.post(url,{"topic" : topic,"recentDays" : 1},
			function(data) {
				var resultData = data.data.pageData;
				if (resultData != null) {
					for (i in resultData) {
						$.each(resultData[i].data,function(entryIndex, entry) {
									var sentimentColor = "#0033FF";
									if (entry.sentiment.indexOf("正面") >= 0)
										sentimentColor = "#009966";
									else if (entry.sentiment.indexOf("负面") >= 0)
										sentimentColor = "#CC3399";
									content += "<div style='text-align:left;'><div><ul class='page-header' style=\"list-style-type:none\" >"
										+ "<li><strong>" + entry.title
										+ "</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>" + entry.source
										+ " </strong>" + entry.pubTime
										+ "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: " + sentimentColor + "'>"
										+ entry.sentiment + "</span>]</li>" + "<li class=''><strong>[摘要]</strong>: "
										+ entry.summerize + "</li>"
								        + "<li class=''>主题：<a><strong>" + entry.topic
										+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "[关注度: <span style='color: #FF9900'><strong>" + entry.attentionLevel
										+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于"
										+ entry.crawlTime + "  采自<strong>" + entry.source
										+ "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
										+ "</li></ul></div></div>";
								});
					}
				} else {
					content += "没有相关数据";
				}
			});
	OpenWindow = window.open();
	OpenWindow.document.write("<html>");
	OpenWindow.document.write("<title>打印页面</title>");
	OpenWindow.document.write("<body><div align=\"center\"><h3>" + topicName
			+ "&nbsp;&nbsp;主题数据报告</h3></div><h4 class=\"page-header\">主题数据报告</h4>");//
	OpenWindow.document.write("<div id=\"printReport\">" + todaydata
			+ "</div><h4 class=\"page-header\">主题详细数据</h4><div id=\"printDetailReport\" class=\"container-fluid\">");
	OpenWindow.document.write("<div class=\"well row-fluid\" id=\"dataArea\">" + content + "</div></div>");
	OpenWindow.document
	.write("<div id=\"p\" align=\"center\"><a class=\"printP\"  href=\"javascript:window.print()\">打印</a></div>");
	OpenWindow.document.write("</body>");
	OpenWindow.document.write("</html");
	OpenWindow.document.close();
	// titlHtml();
}
//根据主题id来显示舆情摘报
function paperDisplayById(obj) {
	var topicId = obj.id;
	var topicName = obj.name;
	var nowDate = new Date();
	// 计算日期
	endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
	+ nowDate.toLocaleTimeString();
	days = 1;
	var beginDate = new Date();
	var beforDate = nowDate.getTime() - 0 * 24 * 60 * 60 * 1000;
	beginDate.setTime(beforDate);
	startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-" + beginDate.getDate()
	+ " 00:00:00";
	var content = "<div class=\"row-fluid\"><div  class=\"span12 well\"><h4><a>"
		+ topicName
		+ "&nbsp;&nbsp;</a>今日专题简报(<a style='cursor:pointer;' onclick=\"javascript:printPaperById(this);\" id=\""
		+ topicId
		+ "\" name=\""
		+ topicName
		+ "\">打印报告</a>)</h4>"
		+ "<h4 id='title' class=\"page-header\"></h4>"// 主题数据报告
		+ "<div id=\"dataReport\" style=\"height: 75px;\"></div></div><h4 class=\"page-header\">主题详细数据</h4><div id=\"topicDetailReport\" class=\"container-fluid\">"
		+ "<div class=\"row-fluid\"><div class=\"page-header\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>舆 情 摘 要</strong><span class=\"pull-right\">排序:<select id=\"listsort\""
		+ "class=\"selcombobox\" style=\"height: 25px; width: 100px;\" name=\"listsort\" onchange='javascript:SearchByOrder(this);'><option value=\"1\" selected=\"selected\">按情感值</option><option value=\"2\">按发表时间</option>"
		+ "<option value=\"3\">按采集时间</option><option value=\"4\">按热度</option><option value=\"5\">按相关度</option></select></span></div><div class=\"well\" id=\"dataArea\"></div></div>"
		+ "<div class=\"btn-group\"><button class=\"btn\">第</button><button id=\"currentPage\" class=\"btn\"></button><button class=\"btn\">页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button>"
		+ "<button id=\"totalPage\" class=\"btn\"></button>"
		+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button id=\"pagebackward\" class=\"btn\">上一页</button><button id=\"pageforward\" class=\"btn\">下一页</button></div>"
		+ "<div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"recordCount\" class=\"btn\"></button><button class=\"btn\">条</button>"
		+ "</div><div class=\"btn-group\"><button class=\"btn\">每页</button><select id=\"recordPage\" class=\"input-mini changePage\"><option>10</option>"
		+ "<option>20</option><option>30</option><option>40</option><option>50</option></select></div>"
		+ "<div class=\"btn-group\"><button id=\"goto\" class=\"btn\">跳转</button><input id=\"gotopage\" type=\"text\" class=\"input-mini changePage\" placeholder=\"页码\"/></div>"
		+ "</div>" + "</div></div>";
	$("#abstactData").empty().append(content);

	var content2 = "";
	var OutlineHtml = "";
	var url = '../../handler/epostat/statSum';
	$
	.post(
			url,
			{
				"recentDays" : 1,
			},
			function(data) {
				if (data.data != null && data.data.statData != null) {
					var resultData = data.data.statData;
					titlHtml(startTime, endTime);
					OutlineHtml = /*
					 * "本报告的数据来自：从 <a><strong>" +
					 * startTime + "</strong></a>到 <a><strong>" +
					 * endTime + "</strong></a>日间</br>"+
					 */
						"<ul class='read13'><li>更新内容网站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.updateTopicCount
						+ "个</li>"
						+ "<li>监测主题数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.topicCount
						+ "个</li>"
						+ "<li>采集网站数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.metaSearchCount
						+ "个</li></ul>"
						+ "<ul class='read23'><li>监测预警舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?warn=-6'><strong>"
						+ resultData.warningCount
						+ "</strong></a>条</li>"
						+ "<li>初判负面舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?sentiment=-1'><strong>"
						+ resultData.negCount
						+ "</strong></a></li>"
						+ "<li>监测舆情数量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						+ resultData.totalCount
						+ "条</li></ul>"
						+ "<ul class='read33'><li>重点关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?attentionLevel=3'><strong>"
						+ resultData.attSpecialCount
						+ "</strong></a>条</li>"
						+ "<li>比较关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?attentionLevel=1'><strong>"
						+ resultData.attGeneralCount
						+ "</strong></a>条</li>"
						+ "<li>一般关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?sentiment=-1'><strong>"
						+ resultData.negCount + "</strong></a>条</li></ul>";
					var url1 = '../../handler/epostat/statByTimeRange';
					var content3 = "";
					var num = 0;
					$.post(url1, {
						"recentDays" : 1,
						"topic" : topicId
					}, function(data) {
						var resultData = data.data.statData;
						var i = 0;
						for (i in resultData) {
							num = num + resultData[i].count;
						}
						content3 = OutlineHtml + content2;// + num +
						// content2;//多了个num，导致打印和显示时下方多了个数字，也不知这干啥的，暂时屏蔽
						$("#dataReport").html(content3);
					});
				} else {
					$("#dataReport").html("没有相关数据");
				}
			});

	// 显示今日主题详细数据
	viewaction = '../../handler/epoquery/query';
	params = {
			"recentDays" : 1,
			"topic" : topicId,
			"pageArray" : new Array(),
			"recordPerPage" : 10
	};
	flag = 1;
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	// 绑定搜索按钮
	bindSearch();
	// 主题摘要的显示
	var urlf = "../../handler/summary/querysummary"
		$.post(urlf, {
			"topic" : topicId
		}, function(data) {
			if (data.data.summary == null) {
				$("#topicSummary").append("没有爬取回相关数据！");
			} else {
				$("#topicSummary").append(data.data.summary);
			}
		});
}
function timedistrDisplay() {
	$.ajaxSettings.async = false;
	var areaData = new Array();
	var url = '../../handler/epostat/statByTimeRange';
	$.post(url, {
		"recentDays" : 1
	}, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			var i = 0;
			for (i in resultData) {
				var areaA = new Array();
				areaA[0] = resultData[i].timeDesc;
				areaA[1] = resultData[i].count;
				areaData[i] = areaA;
			}
		}
	});
	$('#time').highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF",
		},
		title : {
			text : '今日舆情时段趋势图'
		},
		yAxis : {
			title : {
				text : 'count'
			}
		},

		plotOptions : {
			spline : {
				lineWidth : 0.8,
				lineColor : '#00CCFF',
				fillOpacity : 0.5,
				marker : {
					enabled : true,
					radius : 2,
					states : {
						hover : {
							enabled : true,
							radius : 4
						}
					}
				},
			},
			dataLabels : {
				formatter : function() {
					return this.value;
				}
			}
		},
		series : [ {
			name : '时段',
			data : areaData
		} ]
	});
}
//主页主题分布显示所有的主题信息
function topicdistrDisplay() {
	$.ajaxSettings.async = false;
	var pieData = new Array();
	var url = '../../handler/epostat/statByTopic';
	$.post(url, {
		"recentDays" : 1,
		"topNum" : 10
	}, function(data) {
		var resultData = data.data.statData;
		var i = 0;
		if (resultData != null) {
			for (i in resultData) {
				var pieA = new Array();
				pieA[0] = resultData[i].indicator;
				pieA[1] = resultData[i].count;
				pieData[i] = pieA;
			}
		}
	});
	$('#topic').highcharts({
		chart : {
			type : 'pie',
			options3d : {
				enabled : true,
				alpha : 45,
				beta : 0
			}
		},
		title : {
			text : '今日舆情主题分布图'
		},
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				dataLabels : {
					enabled : true,
					color : '#000033',
					connectorColor : '#33CCCC',
					formatter : function() {
						return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
					}
				}
			}
		},
		series : [ {
			type : 'pie',
			data : pieData
		} ]
	});
}
//网站分布图
function sitedistrDisplay() {
	$.ajaxSettings.async = false;
	var colors = Highcharts.getOptions().colors;
	var columnData = new Array();
	var categories = new Array();
	var url = '../../handler/epostat/statByMetaSearch';
	$.post(url, {
		"recentDays" : 1,
		"topNum" : 10
	}, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			var i = 0;
			for (i in resultData) {
				categories[i] = resultData[i].indicator;
				columnData[i] = resultData[i].count;
			}
		}
	});
	$('#metasearch').highcharts({
		chart : {
			plotBorderWidth : 0.5,
			plotShadow : true
		},
		title : {
			text : '今日舆情站点分布图'
		},
		xAxis : {
			categories : categories

		},
		yAxis : {
			title : {
				text : 'count'
			}
		},
		plotOptions : {
			area : {
				allowPointSelect : true,
				dataLabels : {
					formatter : function() {
						return this.value;
					}
				}
			}
		},
		series : [ {
			type : 'column',
			name : '站点',
			data : columnData,
			color : colors[4]
		} ]
	});
}
function SearchByOrder(obj) {
	getParams();
	var order = $('#' + obj.id).val();
	params.orderField = order;
	initSearch();
	return false;
}