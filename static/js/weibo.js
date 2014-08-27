var metaSearch = "";//
var attentionLevel = "";// 
var topic = "";// 
var sentiment = "";// 
var warn = "";// 
var orderField = 1;// 
var recentDays = '';// 查询的天数。0表示选择的是时间段
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var viewaction = '';// 分页请求的action
var params = {};// 请求的参数
$(document).ready(function() {
	backToTop();// back To Top
	paginationPage();// 键入页码，分页等标识
	// 绑定时间选择控件
	$('#begintime').datetimepicker();
	$('#endtime').datetimepicker();
	$("#searchByTime").hide();
	topicColunmShow();
	commonpartDisplay();
	// 初始化action和请求参数
	viewaction = "../../handler/weibo/query";
	params = {
		"metaSearch" : metaSearch,
		"attentionLevel" : attentionLevel,
		"topic" : topic,
		"sentiment" : sentiment,
		"startTime" : '',
		"recentDays" : recentDays,
		"endTime" : '',
		"orderField" : orderField,
		"warn" : warn,
		"pageArray" : new Array(),
		"recordPerPage" : 30
	};
	// /parmers
	if (getRequest("recentDays") != null && getRequest("recentDays") != "" && getRequest("recentDays") > 0) {
		recentDays = getRequest("recentDays");
		params.recentDays = recentDays;
		var id = "i51";
		$("#" + id).attr("class", "rio");
		if (recentDays == 1) {
			id = "i52";
			$("#" + id).attr("class", "rio reactive");
		}
	}
	if (getRequest("attentionLevel") != null && getRequest("attentionLevel") != "") {
		attentionLevel = getRequest("attentionLevel");
		params.attentionLevel = attentionLevel;
		var id = "i21";
		$("#" + id).attr("class", "rio");
		id = "i2" + (parseInt(attentionLevel) + 1);
		$("#" + id).attr("class", "rio reactive");
	}
	if (getRequest("sentiment") != null && getRequest("sentiment") != "") {
		sentiment = getRequest("sentiment");
		params.sentiment = sentiment;
		var id = "i11";
		$("#" + id).attr("class", "rio");
		id = "i1" + (parseInt(sentiment) + 3);
		$("#" + id).attr("class", "rio reactive");
	}
	if (getRequest("warn") != null && getRequest("warn") != "") {
		warn = getRequest("warn");
		params.warn = warn;
		if (warn == -6) {
			var id = "i21";
			$("#" + id).attr("class", "rio");
			id = "i25";
			$("#" + id).attr("class", "rio reactive");
		}
		if (getRequest("orderField")) {
			orderField = getRequest("orderField");
			params.orderField = orderField;
			$("#listsort").val(orderField);
		}
	}
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	checkbyvalue(fristPage);// 初始化页码
	// 加载舆情趋势
	webTrendsDisplay();
	sentByTimeDisplay();
	showkeywordCloud();// 词云
});
// 加载数据到数据区域
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	if (pageRecords.data.length == 0) {
		$("#dataArea").empty();
		$("#dataArea").append("<div class='titleEpo'>没有相关结果！</div>");
	} else {
		$("#dataArea").empty();
		$
				.each(
						pageRecords.data,
						function(entryIndex, entry) {
							var content = entry.title + "*&&*" + entry.summerize + "*&&*" + entry.source + "*&&*"
									+ entry.source + "*&&*" + entry.crawlTime + "*&&*" + entry.pubTime + "*&&*"
									+ entry.sentiment + "*&&*" + entry.url + "*&&*" + entry.topic + "*&&*"
									+ entry.attentionLevel;// 收藏内容
							var sentimentColor = "#0033FF";
							if (entry.sentiment.indexOf("正面") >= 0)
								sentimentColor = "#009966";
							else if (entry.sentiment.indexOf("负面") >= 0)
								sentimentColor = "#CC3399";
							entry.title = titleFormat(entry.title, 25); // 缩减过长的标题
							var rowhtml = "<div><ul class='page-header'  style=\"list-style-type:none\">"
									+ "<li><a class='titleEpo' target='_blank' href='"
									+ entry.url
									+ "'><i class='icon-tag'></i>"
									+ entry.title
									+ "</a>"
									+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;["
									+ entry.pubTime
									+ "发布 ]&nbsp;&nbsp;&nbsp;&nbsp;[<span style='color: "
									+ sentimentColor
									+ "'>"
									+ entry.sentiment
									+ "</span>]</li>"
									+ "<li class=''><strong>[内容]</strong>: "
									+ entry.summerize.replace("查看全文>>", "")
									+ "</li>"
									+ "<li class=''>主题：<a><strong>"
									+ entry.topic
									+ "</strong></a>&nbsp;&nbsp;&nbsp;&nbsp;"
									+ "[关注度: <span style='color: #FF9900'><strong>"
									+ entry.attentionLevel
									+ "</strong></span>]&nbsp;&nbsp;&nbsp;&nbsp;"
									+ "[于"
									+ entry.crawlTime
									+ "采自<strong>"
									+ entry.source
									+ "</strong>]&nbsp;&nbsp;&nbsp;&nbsp;"
									+ "[转载数:"
									+ entry.progation
									+ "&nbsp;&nbsp;--评论数:"
									+ entry.comment
									+ "]&nbsp;&nbsp;&nbsp;<div class='contentLeft'>";
							if (role == 1) {
								rowhtml += "<a id='"
										+ entry.id
										+ "' style='cursor:pointer;' title='删除舆情记录' onclick='javascript:deleteWebBo(this);' class=''>删除</a>&nbsp;&nbsp;|";
							}
							rowhtml += "&nbsp;&nbsp;"
									+ "<a id='collect"
									+ entry.id
									+ "' style='cursor:pointer;' title='收藏' onclick='javascript:collect(this,2);' value='"
									+ content + "' class=''>收藏</a></div></li>" + "</ul></div>";
							$("#dataArea").append(rowhtml);
							startIndex = startIndex + 1;
						});
	}
	searchCollect(2);// 查询收藏
}
// 删除
function deleteWebBo(obj) {
	var ids = obj.id;
	if (confirm("删除将无法恢复,是否继续删除!!")) {
		$.post("../../handler/weibo/deleteWeiBo", {
			"ids" : ids
		}, function(result) {
			if (result.ret) {
				$(obj).parents('ul').remove();
			}
		}, "json");
	}
}

// 词云
function showkeywordCloud() {
	$.post("../../handler/weibo/showKeywords", params, function(data) {
		if (data.data != null && data.data.keywords != null && data.data.keywords.length > 0) {
			var keywords = data.data.keywords;
			var word_array = keywords;
			$("#topicCloud").empty().jQCloud(word_array);
		} else {
			$("#topicCloud").empty().append("没有相关数据！");
			return false;
		}
	});
}
function topicColunmShow() {
	url = "../../handler/column/viewAllTopic";
	var colunmHtml = "";
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
							colunmHtml += "<div class='accordion-body in collapse' id='accordion-element-2'>";
							$
									.each(
											topicData,
											function(entrtIndex, entry) {
												if (entry.topicCat != null) {
													colunmHtml += "<div class='accordion-heading'><a class='accordion-toggle' data-parent='accordion-1' data-toggle='collapse' href='#accordion-element-2"
															+ i
															+ "'>&nbsp;&nbsp;<i class='icon-tags'></i>"
															+ entry.topicCat + "</a></div>";
													if (entry.topicList != null) {
														colunmHtml += "<div class='accordion-body collapse' id='accordion-element-2"
																+ i + "'>";
														$
																.each(
																		entry.topicList,
																		function(subEntrtIndex, subEntry) {
																			colunmHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-star'></i><a href='#' name='topic' id='"
																					+ subEntry.topicId
																					+ "' onclick='javascript:SearchByTopicId(this);''>"
																					+ subEntry.topicName + "</a></br>";
																		});
														colunmHtml += "</div>";
													}
												}
												i++;
											});
							colunmHtml += "</div>";
						}
						$("#topicDis").append(colunmHtml);
					});
}
function SearchByMetaId(obj) {
	getParams();
	metaSearch = obj.id;
	params.metaSearch = metaSearch;
	params.topic = "";
	initSearch();
	showkeywordCloud();// 词云
	return false;
}
function SearchByTopicId(obj) {
	var id = obj.id;
	var $nodes = $("a[name='topic']");
	if ($nodes) {
		$nodes.each(function() {
			$(this).attr("class", "");
		});
	}
	$(obj).attr("class", "reactive");
	// 去除主题样式
	var $nodes = $("a[name='i3']");
	if ($nodes) {
		$nodes.each(function() {
			$(this).attr("class", "rio");
		});
	}
	getParams();
	params.topic = id;
	params.metaSearch = "";
	initSearch();
	// 加载舆情趋势
	showkeywordCloud();
	webTrendsDisplay();
	sentByTimeDisplay();
	return false;
}

function bindSubCol() {
	$('.subcol').live("click", function() {
		var colid = $(this).parent().parent().attr('value');
		nowColId = colid;
		// 左边树对应展开和激活
		$('.column').parent().parent().removeClass('active');
		var $currentLi = $('#' + colid);
		$currentLi.addClass('active');
		// 首先隐藏所有节点,并更改所有展开图标样式
		$('#columns').find('ul').hide().end().find('.expand').removeClass('icon-minus').addClass('icon-plus');
		// 循环展开所有父栏目
		$currentLi = $currentLi.parent('ul').parent('li');
		while ($currentLi.length > 0) {
			$currentLi.children('ul').show();
			$currentLi.children('a').children('i').removeClass('icon-plus').addClass('icon-minus');
			$currentLi = $currentLi.parent('ul').parent('li');
		}
		// 加载栏目信息
		loadColInfo();
		return false;
	});
}
// 右上方公共部分的显示
function commonpartDisplay() {
	$.ajaxSettings.async = false;
	$("#levelone").empty();
	// 加载主题
	var content1 = "";
	var url = "../../handler/topic/queryHotTopic";
	$.post(url, {
		"topNum" : 5
	}, function(data) {
		var resultData = data.data.data;
		if (resultData != null) {
			$.each(resultData, function(entryIndex, entry) {
				content1 = content1
						+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i3\" id=\"i3"
						+ entry.id + "\" onclick=\"radioDisplay(this);\">" + entry.indicator + "</a>";
			});
		}
	});
	var radioHtml = "<div class=\"tabbable well\"> <ul class=\"nav nav-tabs\">"
			+ "<li><a style='cursor:pointer;' data-toggle=\"tab\" onclick='turnOther();'><i class='icon-globe'></i>网页舆情</a></li>"
			+ "<li  class='active'><a data-toggle=\"tab\"><i class='icon-tasks'></i>微博舆情</a></li></ul>"
			//
			+ "<div class=\"tab-content tab-content-wide\" ><div  class=\"tab-pane active\" id=\"web-filter\">"
			+ "<div><span class='label label-info'>情感倾向</span>"
			+ "<a href=\"javascript:void(0);\" class='rio reactive' style='cursor:pointer;' name=\"i1\" id=\"i11\" onclick=\"radioDisplay(this);\">不限</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i1\"  id=\"i12\" onclick=\"radioDisplay(this);\">负面舆情</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i1\" id=\"i13\" onclick=\"radioDisplay(this);\">正面舆情</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i1\" id=\"i14\"  onclick=\"radioDisplay(this);\">中性舆情</a></div>"
			//
			+ "<div><span class='label label-info'>关注状态</span>"
			+ "<a href=\"javascript:void(0);\" class='rio reactive' style='cursor:pointer;' name=\"i2\" id=\"i21\" onclick=\"radioDisplay(this);\">不限</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i2\"  id=\"i22\" onclick=\"radioDisplay(this);\">一般关注</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i2\" id=\"i23\" onclick=\"radioDisplay(this);\">比较关注</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i2\" id=\"i24\"  onclick=\"radioDisplay(this);\">重点关注</a>"
//			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i2\" id=\"i25\"  onclick=\"radioDisplay(this);\">发生预警</a></div>"
			//
			+ "<div><span class='label label-info'>舆情主题</span>"
			+ "<a href=\"javascript:void(0);\" class='rio reactive' style='cursor:pointer;' name=\"i3\" id=\"i30\" onclick=\"radioDisplay(this);\">不限</a>"
			+ content1
			+ "</div>"
			//
			+ "<div><span class='label label-info'>舆情时间</span>"
			+ "<a href=\"javascript:void(0);\" class='rio reactive' style='cursor:pointer;' name=\"i5\" id=\"i51\" onclick=\"radioDisplay(this);\">不限</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i52\" onclick=\"radioDisplay(this);\">今日最新</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i53\" onclick=\"radioDisplay(this);\">最近两天</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i54\"  onclick=\"radioDisplay(this);\">最近一周</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i55\"  onclick=\"radioDisplay(this);\">最近两周</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i56\"  onclick=\"radioDisplay(this);\">最近一月</a>"
			+ "<a href=\"javascript:void(0);\" class='rio' style='cursor:pointer;' name=\"i5\" id=\"i57\"  onclick=\"radioDisplay(this);\">自选时段</a>"
			+ "<form id=\"searchByTime\" class=\"well\"><input id=\"begintime\" class=\"form_datetime\" type=\"text\" placeholder=\"请选择开始时间\">"
			+ "至 <input id=\"endtime\" class=\"form_datetime\" type=\"text\" placeholder=\"请选择结束时间\">"
			+ " <a id=\"searchAll\" class=\"btn\" onclick=\"javascript:radioDisplay(this);\"><i class=\"icon-search\"></i></a>"
			+ "</form></div>"
			+
			// 新加层
			"<ul class=\"nav nav-tabs\" id=\"myTab\"><li class=\"active\"><a data-toggle=\"tab\" href=\"#opinionTrends\">舆情趋势</a></li><li><a data-toggle=\"tab\" href=\"#profile\">情感趋势</a></li>"
			+ "<li><a data-toggle=\"tab\" href=\"#emoDistr\">情感分布</a></li></ul>"
			+ "<div class=\"tab-content\"><div class=\"tab-pane active\" id=\"opinionTrends\"><div class='span9' style='height:200px;width: 700px;' id='trends'></div></div><div class=\"tab-pane\" id=\"profile\"><div class='span9' style='height:200px;' id='trends12'></div></div>"
			+ "<div class=\"tab-pane\" id=\"emoDistr\"><div id=\"emotionalDistr\" style=\"min-width:700px;height:200px\"></div></div></div>"
			+ "</div></div></div>";
	$("#levelone").append(radioHtml);
	// 加载时间插件
	$('#begintime').datetimepicker();
	$('#endtime').datetimepicker();
	$("#searchByTime").hide();
	return;
}
// 页面跳转
function turnOther() {
	window.location = "epoquery.html";
}
// 右上方公共部分的按钮响应
function radioDisplay(obj) {
	$.ajaxSettings.async = false;
	if (obj.id != "searchAll") {
		// 切换active
		var $parent = obj.parentNode;
		$($parent.childNodes).each(function(i, item) {
			if (i > 0) {
				item.setAttribute("class", "rio");
			}
		});
		obj.setAttribute("class", "rio reactive");
	}
	if (obj.id.indexOf("i3") >= 0) {
		var $nodes = $("a[name='topic']");
		if ($nodes) {
			$nodes.each(function() {
				$(this).attr("class", "");
			});
		}
	}
	if (obj.id == "i57") {
		$("#searchByTime").show();
		return;
	}
	getParams();
	if (obj.id == "searchAll") {
		params.recentDays = null;
		// 点击搜索，则是范围查询，用户id置为0
		userid = 0;
		params.startTime = $('#begintime').val() + ":00";
		params.endTime = $('#endtime').val() + ":00";
	}
	initSearch();
	showkeywordCloud();// 词云
	webTrendsDisplay();
	sentByTimeDisplay();
	return false;
}
function SearchByOrder(obj) {
	getParams();
	var order = $('#' + obj.id).val();
	params.orderField = order;
	initSearch();
	showkeywordCloud();// 词云
	return false;
}
// 舆情趋势：显示这个月的统计量
function webTrendsDisplay() {
	$.ajaxSettings.async = false;
	if (!params.recentDays) {
		params.recentDays = 10;
	}
	params.orderField = null;
	var lineLabels = new Array();
	var lineData = new Array();
	var url = '../../handler/epostat/weiboTimeRange';
	var stepNum = 1;
	$.post(url, params, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			timeUnit = data.data.timeUnit;
			if (resultData.length > 20) {
				stepNum = 3;
			}
			if (resultData.length > 40) {
				stepNum = 4;
			}
			if (resultData.length > 55) {
				stepNum = 2;
			}
			var i = 0;
			var j = 0;
			for (i in resultData) {
				if (stepNum == 2) {
					if (i % 2 == 0) {
						lineLabels[j] = resultData[i].timeDesc;
						lineData[j] = resultData[i].count;
						j++;
					}
				} else {
					lineLabels[i] = resultData[i].timeDesc;
					lineData[i] = resultData[i].count;
				}
			}
		} else {
			return false;
		}
	});
	$('#trends').highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF"
		},
		title : {
			text : '舆情趋势图'
		},
		xAxis : {
			categories : lineLabels,
			tickmarkPlacement : 'on',
			title : {
				enabled : false
			},
			labels : {
				step : stepNum,
				formatter : function() {
					if (timeUnit == "时") {
						return this.value.substr(11, 2);
					} else if (timeUnit == "日") {
						return this.value.substr(5, 5);
					} else {
						return this.value;
					}
				}
			}
		},
		yAxis : {
			title : {
				text : '舆情数量'
			},
			min : 0, // 定义最小值
			labels : {
				formatter : function() {
					return this.value;
				}
			}
		},
		tooltip : {
			shared : true,
			valueSuffix : '条'
		},
		plotOptions : {
			spline : {
				lineWidth : 1,
				lineColor : '#00CCFF',
				fillOpacity : 0.8,
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
			}
		},
		series : [ {
			name : '舆情分布(' + timeUnit + ')',
			data : lineData
		} ]
	});
	return false;
}

// 情感趋势
function sentByTimeDisplay() {
	$.ajaxSettings.async = false;
	if (!params.recentDays) {
		params.recentDays = 10;
	}
	params.orderField = null;
	var lineLabels = new Array();
	var Positive = 0, Negative = 0, Neutral = 0;
	var lineData = new Array();
	var lineData1 = new Array();
	var lineData0 = new Array();
	var stepNum = 1;
	var url = '../../handler/weibostat/sentByTimeRange';
	$.post(url, params, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			timeUnit = data.data.timeUnit;
			if (resultData.length > 20) {
				stepNum = 3;
			}
			if (resultData.length > 40) {
				stepNum = 4;
			}
			if (resultData.length > 55) {
				stepNum = 6;
			}

			for ( var i in resultData) {
				lineLabels[i] = resultData[i].timeDesc;
				lineData[i] = resultData[i].count;
				Neutral += parseInt(resultData[i].count);
			}
		} else {
			$('#trends12').empty().append("没有相关数据！");
			return false;
		}
		if (data.data != null && data.data.statData1 != null && data.data.statData1.length > 0) {
			var resultData1 = data.data.statData1;
			timeUnit = data.data.timeUnit;
			for ( var i in resultData1) {
				lineData1[i] = resultData1[i].count;
				Positive += parseInt(resultData1[i].count);
			}
		} else {
			$('#trends12').empty().append("没有相关数据！");
			return false;
		}
		if (data.data != null && data.data.statData0 != null && data.data.statData0.length > 0) {
			var resultData0 = data.data.statData0;
			timeUnit = data.data.timeUnit;
			for ( var i in resultData0) {
				lineData0[i] = resultData0[i].count;
				Negative += parseInt(resultData0[i].count);
			}
		} else {
			$('#trends12').empty().append("没有相关数据！");
			return false;
		}
		if (Neutral && Positive && Negative) {
			var total = Neutral + Positive + Negative;
			Neutral = Neutral / total;
			Positive = Positive / total;
			Negative = Negative / total;
		} else {
			$('#emotionalDistr').empty().append("没有相关数据！");
			return false;
		}
	});
	$('#trends12').highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF"
		},
		title : {
			text : '情感趋势图'
		},
		xAxis : {
			categories : lineLabels,
			tickmarkPlacement : 'on',
			title : {
				enabled : false
			},
			labels : {
				step : stepNum,
				formatter : function() {
					if (timeUnit == "时") {
						return this.value.substr(11, 2);
					} else if (timeUnit == "日") {
						return this.value.substr(5, 5);
					} else {
						return this.value;
					}
				}
			}
		},
		yAxis : {
			title : {
				text : '舆情数量'
			},
			min : 0, // 定义最小值
			labels : {
				formatter : function() {
					return this.value;
				}
			}
		},
		tooltip : {
			shared : true,
			valueSuffix : ' 条'
		},
		plotOptions : {
			spline : {
				lineWidth : 1,
				fillOpacity : 0.8,
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
			}
		},
		series : [ {
			name : '中性情感(' + timeUnit + ')',
			data : lineData
		}, {
			name : '正面情感(' + timeUnit + ')',
			data : lineData1
		}, {
			name : '负面情感(' + timeUnit + ')',
			data : lineData0
		} ]
	});
	// Build the chart
	if (Neutral == 0 && Positive == 0 && Negative == 0) {
		$('#emotionalDistr').empty().append("没有相关数据！");
	} else {
		$('#emotionalDistr').highcharts(
				{
					chart : {
						type : 'pie',
						options3d : {
							enabled : true,
							alpha : 45,
							beta : 0
						}
					},
					title : {
						text : '情感分布图'
					},
					tooltip : {
						pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
					},
					plotOptions : {
						pie : {
							allowPointSelect : true,
							cursor : 'pointer',
							depth : 35,
							dataLabels : {
								enabled : true,
								color : '#000033',
								connectorColor : '#33CCCC',
								formatter : function() {
									return '<b>' + this.point.name + '</b>: '
											+ Highcharts.numberFormat(this.percentage, 2) + ' %';
								}
							}
						}
					},
					series : [ {
						type : 'pie',
						name : 'Browser share',
						data : [ [ '中性', Neutral ], [ '正面', Positive ], [ '负面', Negative ] ]
					} ]
				});
	}
	return false;
}

function getParams() {
	// 取radio的值
	var p1 = $("a[name='i1'][class$='reactive']").attr("id");
	var p2 = $("a[name='i2'][class$='reactive']").attr("id");
	var p3 = $("a[name='i3'][class$='reactive']").attr("id");
	var p4 = $("a[name='i4'][class$='reactive']").attr("id");
	var p5 = $("a[name='i5'][class$='reactive']").attr("id");
	if (p1 == "i12") {
		params.sentiment = -1;
	} else if (p1 == "i13") {
		params.sentiment = 1;
	} else if (p1 == "i14") {
		params.sentiment = 0;
	} else {
		params.sentiment = null;
	}
	if (p2 == "i22") {
		params.attentionLevel = 1;
	} else if (p2 == "i21") {
		params.warn = "";
	} else if (p2 == "i23") {
		params.attentionLevel = 2;
	} else if (p2 == "i24") {
		params.attentionLevel = 3;
	} else if (p2 == "i25") {
		params.warn = -6;
		params.attentionLevel = null;
	} else {
		params.attentionLevel = null;
	}
	// 判断当前的舆情主题哪个被选中了
	if (p3) {
		if (p3 == "i30") {
			params.topic = null;
		} else {
			topic = parseInt(p3.replace("i3", ""));
			params.topic = topic;
		}
	}
	// 扫描当前舆情事件选中按钮在哪里
	if (p5 == "i52") {
		params.recentDays = 1;
	} else if (p5 == "i53") {
		params.recentDays = 2;
	} else if (p5 == "i54") {
		params.recentDays = 7;
	} else if (p5 == "i55") {
		params.recentDays = 14;
	} else if (p5 == "i56") {
		params.recentDays = 30;
	} else {
		params.recentDays = null;
	}
	if (params.recentDays > 0)
		$("#searchByTime").hide();
}