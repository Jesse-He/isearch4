var params;// 请求的参数
var startTime = '';// 查询的开始时间
var hotTopic = '';
var endTime = '';// 查询的结束时间
var days = '';// 查询的天数。0表示选择的是时间段
var topNum = '';// 查询top "number" : 10
var viewaction = '';// 分页请求的action
$(document).ready(function() {
	backToTop();// back To Top
	// 绑定时间选择
	$('#begintime').datetimepicker();
	$('#endtime').datetimepicker();
	showMetaColumn();
	params = {
			"category" : "",
			"startTime" : "",
			"endTime" : "",
			"query" : "",
			"recentDays" : 1,
			"pageArray" : new Array(),
			"recordPerPage" : 20,
			"sentiment" : "",
			"metaSearch" : "",
			"indexLoc" : "",
			"isPubDate" : ""
	};
	$.ajaxSettings.async = false;
	getTopic();
	showData();
	checkbyvalue(fristPage);// 初始化页码
});
function showData() {
	getParams();
	params.query = hotTopic;
	$('#keywords').val(hotTopic);
	viewaction = "../../handler/epoquery/fullTextSearch";
	if ($('#datetype').val() == 10000) {
		$("#searchTime").show();
	} else
		$("#searchTime").hide();
	// 绑定搜索按钮
	bindSearch();
	paginationPage();
	initialBind();// 绑定分页的一些操作响应
	initSearch();
}
function getTopic() {
	var url = "../../handler/topic/queryHotTopic";
	$.post(url, {
		"topNum" : 1
	}, function(data) {
		var resultData = data.data.data;
		if (resultData != null) {
			$.each(resultData, function(entryIndex, entry) {
				hotTopic = entry.indicator;
			});
		} else
			hotTopic = "绵阳";
	});
}
function bindSearch() {
	$('#search').click(function() {
		getParams();
		if (params.query) {
			initSearch();
			return false;
		} else {
			alert("请输入检索关键词！");
			return false;
		}
	});
}
//绑定time按钮操作
function TimeSearchResult(obj) {
	var option = obj.value;
	if (option == 10000) {
		$("#searchTime").show();
	} else
		$("#searchTime").hide();
	return false;
}
//获取参数
function getParams() {
	// 点击搜索，一切重新查找
	var days = $('#datetype').val();
	if (0 < days && days <= 365) {
		params.recentDays = days;
	} else if (days == 10000) {
		if ($('#begintime').val() && $('#endtime').val()) {
			params.startTime = $('#begintime').val() + ":00";
			params.endTime = $('#endtime').val() + ":00";
			params.recentDays = "";
		}
	} else {
		params.recentDays = "";
		params.startTime = "";
		params.endTime = "";
	}
	params.category = $('#category').val();
	params.query = $('#keywords').val();
	params.indexLoc = $('#fieldtype').val();
	params.isPubDate = $('#datefield').val();
	params.sentiment = $('#emotiontype').val();
	params.metaSearch = $('#mediatype').val();
}
function GetRadioValue(RadioName) {
	var obj;
	obj = document.getElementsByName(RadioName);
	if (obj != null) {
		var i;
		for (i = 0; i < obj.length; i++) {
			if (obj[i].checked) {
				return obj[i].value;
			}
		}
	}
	return null;
}
//加载数据到数据区域
function refreshContent(pageRecords) {
	// var $records = $('#dataArea').children('tbody');
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	// $records.empty();
	if (pageRecords.data.length == 0) {
		$("#dataArea").empty();
		$("#dataArea").append("<div class='titleEpo'>没有相关结果！</div>");
	} else {
		$("#dataArea").empty();
		$
		.each(
				pageRecords.data,
				function(entryIndex, entry) {
					var sentimentColor = "#0033FF";
					if (entry != null) {
						var content = entry.title + "*&&*" + entry.summerize + "*&&*" + entry.source + "*&&*"
						+ entry.source + "*&&*" + entry.crawlTime + "*&&*" + entry.pubTime + "*&&*"
						+ entry.sentiment + "*&&*" + entry.url + "*&&*" + entry.topic + "*&&*"
						+ entry.attentionLevel;// 收藏内容
						if (entry.sentiment.indexOf("正面") >= 0)
							sentimentColor = "#009966";
						else if (entry.sentiment.indexOf("负面") >= 0)
							sentimentColor = "#CC3399";
						var rowhtml = "<div><ul class='page-header'  style=\"list-style-type:none\" id="
							+ entry.webPageId + ">" + "<li><a class='titleEpo' target='_blank' href='"
							+ entry.url + "'><i class='icon-tag'></i>" + entry.title + "</a>"
							+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<strong>" + entry.source + " </strong>"
							+ entry.pubTime
							+ "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: "
							+ sentimentColor + "'>" + entry.sentiment + "</span>]</li>"
							+ "<li class=''><strong>[摘要]</strong>: "
							+ entry.summerize.replace("查看全文>>", "") + "</li>"
							+ "<li class=''>主题：<a><strong>" + entry.topic
							+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
							+ "[关注度: <span style='color: #FF9900'><strong>" + entry.attentionLevel
							+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "[于"
							+ entry.crawlTime + "采自<strong>" + entry.source
							+ "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class='contentLeft'>"
							if ($('#category').val() == "webpage") {// 检索结果是网页
								if (role == 1) {
									rowhtml += "<a id='"
										+ entry.id
										+ "' title='删除舆情记录' style='cursor:pointer;' class='' onclick='javascript:deleteSearchResult(this,1);'>删除</a>&nbsp;&nbsp;|";
								}
								rowhtml += "&nbsp;&nbsp;"
									+ "<a id='collect"
									+ entry.id
									+ "' title='收藏' style='cursor:pointer;' onclick='javascript:collect(this,3);' value='"
									+ content + "' class=''>收藏</a>&nbsp;&nbsp;</div></li></ul></div>";
							} else if ($('#category').val() == "weibo") {// 检索结果是微博
								if (role == 1) {
									rowhtml += "<a id='"
										+ entry.id
										+ "' title='删除舆情记录' style='cursor:pointer;' class='' onclick='javascript:deleteSearchResult(this,2);'>删除</a>&nbsp;&nbsp;|";
								}
								rowhtml += "&nbsp;&nbsp;"
									+ "<a id='collect"
									+ entry.id
									+ "' title='收藏' style='cursor:pointer;' onclick='javascript:collect(this,4);' value='"
									+ content + "' class=''>收藏</a></div></li></ul></div>";
							}

						$("#dataArea").append(rowhtml);
						startIndex = startIndex + 1;
					}
				});
		if ($('#category').val() == "webpage") {
			searchCollect(1);// 查询检索结果中网页舆情是否被收藏
		} else if ($('#category').val() == "weibo") {
			searchCollect(2);// 查询检索结果中微博舆情是否被收藏
		}

	}
}
function showMetaColumn() {
	// 加载搜索引擎
	var MetaColumnHtml = "";
	var url = "../../handler/metasearch/queryHotMetaSearch";
	$.post(url, {
		"topNum" : 5
	}, function(data) {
		var resultData = data.data.data;
		if (resultData != null) {
			$.each(resultData, function(entryIndex, entry) {
				MetaColumnHtml = MetaColumnHtml + "<option value='" + entry.id + "'>" + entry.indicator + "</option>";
			});
			$("#mediatype").append(MetaColumnHtml);
		}
	});
}
//获取url中的参数
function getRequest(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
function SearchByOrder(obj) {
	var order = $('#' + obj.id).val();
	params.orderField = order;
	initSearch();
}
//删除
function deleteSearchResult(obj, type) {
	$.ajaxSettings.async = false;
	var ids = obj.id;
	var url = "";
	if (type == 1) {// 删除检索结果为网页的
		url = "../../handler/epoquery/deleteWebPage";
	} else if (type == 2) {// 删除检索结果为微博的
		url = "../../handler/weibo/deleteWeiBo";
	}
	if (confirm("删除将无法恢复,是否继续删除!!")) {
		$.post(url, {
			"ids" : ids
		}, function(result) {
			if (result.ret) {
				$(obj).parents('ul').remove();
			}
		}, "json");
	}
}