var params;// 请求的参数
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var recentDays = 0;// 查询的天数。0表示选择的是时间段
var topNum = '';// 查询top "number" : 10
var showType = 0;// 0为显示网络数据，1表示显示微博数据
$(document).ready(
		function() {
			backToTop();// back To Top
			$('#tab1').show();
			$('#tab2').show();
			// 绑定时间选择
			$('#begintime').datetimepicker();
			$('#endtime').datetimepicker();
			var nowDate = new Date();
			endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
					+ nowDate.toLocaleTimeString();
			recentDays = 1;
			var beginDate = new Date();
			var beforDate = nowDate.getTime() - 0 * 24 * 60 * 60 * 1000;
			beginDate.setTime(beforDate);
			startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-"
					+ beginDate.getDate() + " 00:00:00";
			params = {
				"recentDays" : recentDays,
				"startTime" : startTime,
				"endTime" : endTime,
				"topNum" : 10
			};
			$("#searchByTime").hide();
			if (getRequest("recentDays") > 0) {
				recentDays = getRequest("recentDays");
				$("#" + recentDays).click();
			} else {
				params.recentDays = recentDays;
				params.startTime = startTime;
				params.endTime = endTime;
				params.topNum = topNum;
				TimeDisDisplay();
				OutlineDisplay();
				TopicDisDisplay();
				SiteDisDisplay();
				// 绑定搜索按钮
				bindSearch();
			}
			$('#tab2').hide();
			titlHtml();
		});
// 概要报告的内容
function OutlineDisplay() {
	// var url = '../json/analyseInfo.json';
	var url = '../../handler/epostat/statSum';
	var weiboUrl = "../../handler/weibostat/statSum";
	$.post(url, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		OutlineHtml(data);
	});
	$.post(weiboUrl, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		OutlineHtml(data);
	});
}
function OutlineHtml(data) {
	var OutlineHtml = '';
	if (data.data != null && data.data.statData != null) {
		var resultData = data.data.statData;
		OutlineHtml = "<ul class='read13'><li>更新内容网站&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
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
				+ resultData.attSpecialCount + "</strong></a>条</li>"
				+ "<li>比较关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?attentionLevel=1'><strong>"
				+ resultData.attGeneralCount + "</strong></a>条</li>"
				+ "<li>一般关注舆情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='epoquery.html?sentiment=-1'><strong>"
				+ resultData.negCount + "</strong></a>条</li></ul>";
	} else
		OutlineHtml = "没有相关数据";
	$("#weiboOutlineReport").empty().html(OutlineHtml);
	$("#OutlineReport").empty().html(OutlineHtml);
	return;
}
// 舆情时段分布内容
function TimeDisDisplay() {
	$('#weiboTimeDisChart').empty();
	$('#TimeDisChart').empty();
	$('#sentTimeDisChart').empty();
	var url = '../../handler/epostat/statByTimeRange';
	var weiboUrl = '../../handler/weibostat/statByTimeRange';
	var sentiUrl = '../../handler/epostat/sentimentCount';
	var weiboSentiUrl = '../../handler/weibostat/sentimentCount';
	$.post(url, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		var $content = $('#TimeDisChart');
		TimeDisHtml(data, $content);
	});
	$.post(weiboUrl, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		var $content = $('#weiboTimeDisChart');
		TimeDisHtml(data, $content);
	});
	$.post(sentiUrl, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		var $content = $('#sentTimeDisChart');
		sentiDisHtml(data, $content);
	});
	$.post(weiboSentiUrl, {
		"recentDays" : recentDays,
		"startTime" : params.startTime,
		"endTime" : params.endTime
	}, function(data) {
		var $content = $('#weiboSentTimeDisChart');
		sentiDisHtml(data, $content);
	});
}
function sentiDisHtml(data, $content) {
	$.ajaxSettings.async = false;
	$content.empty();
	var lineLabels = new Array();
	var lineData = new Array();
	var stepNum = 1;
	var timeUnit = '';
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
					lineData[j] = resultData[i].sentiment;
					j++;
				}
			} else {
				lineLabels[i] = resultData[i].timeDesc;
				lineData[i] = resultData[i].sentiment;
			}
		}
	}
	$content.highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF",
		},
		title : {
			text : '舆情情感指数走势图'
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
				text : '情感指数'
			},
			plotLines : [ {
				value : 0,
				color : 'green',
				dashStyle : 'shortdash',
				width : 2,
				label : {
					text : '中性'
				}
			} ],
			labels : {
				formatter : function() {
					if (this.value < -20) {
						return "极度负面(" + this.value + ")";
					} else if (this.value < -10) {
						return "比较负面(" + this.value + ")";
					} else if (this.value < -0.5) {
						return "比较负面(" + this.value + ")";
					} else if (this.value > 20) {
						return "极度正面(" + this.value + ")";
					} else if (this.value > 10) {
						return "稍微正面(" + this.value + ")";
					} else if (this.value > 0.5) {
						return "比较正面(" + this.value + ")";
					} else {
						return "中性(" + this.value + ")";
					}
				}
			},
		},
		tooltip : {
			shared : true,
			valueSuffix : ' ',
			valueDecimals : 5,// 数据值保留小数位数
		},
		plotOptions : {
			spline : {
				lineWidth : 1,
				lineColor : '#FE2E64',
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
			name : '情感指数 (' + timeUnit + ')',
			data : lineData
		} ]
	});
}
function TimeDisHtml(data, $content) {
	$.ajaxSettings.async = false;
	$content.empty();
	var lineLabels = new Array();
	var lineData = new Array();
	var stepNum = 1;
	var timeUnit = '';
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
			stepNum = 5;
		}
		var i = 0;
		var j = 0;
		for (i in resultData) {
			if (stepNum >= 5) {
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
	}
	$content.highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF",
		},
		title : {
			text : '舆情分布'
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
				text : '舆情条数'
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
				lineColor : '#0040FF',
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
			},
			labels : {
				formatter : function() {
					return this.value;
				}
			}
		},
		series : [ {
			name : '舆情分布(' + timeUnit + ')',
			data : lineData
		} ]
	});
}

// 舆情主题分布内容
function TopicDisDisplay() {
	$.ajaxSettings.async = false;
	var url = '../../handler/epostat/statByTopic';
	var weiboUrl = '../../handler/weibostat/statByTopic';
	$.post(url, params, function(data) {
		var $content = $('#TopicDisChart');
		var $descContent = $('#TopicDiDesc');
		TopicDisHtml(data, $content, $descContent);
	});
	$.post(weiboUrl, params, function(data) {
		var $content = $('#weiboTopicDisChart');
		var $descContent = $('#weiboTopicDiDesc');
		TopicDisHtml(data, $content, $descContent);
	});
}
function TopicDisHtml(data, $content, $descContent) {
	$.ajaxSettings.async = false;
	$content.empty();
	$descContent.empty();
	var pieData = new Array();
	var TopicDisHtml = '';
	if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
		var resultData = data.data.statData;
		var i = 0;
		var listHtml = "</br></br>";
		for (i in resultData) {
			listHtml = listHtml + "<li><a>" + resultData[i].indicator + "</a> 相关舆情：<a>" + resultData[i].count
					+ " </a>条</li><br>";
			var pieA = new Array();
			pieA[0] = resultData[i].indicator;
			pieA[1] = resultData[i].count;
			pieData[i] = pieA;

		}
		TopicDisHtml = "<ul>" + listHtml + "</ul>";
	} else
		TopicDisHtml = "没有相关数据";
	$descContent.html(TopicDisHtml);
	$content.highcharts({
		chart : {
			type : 'pie',
			options3d : {
				enabled : true,
				alpha : 45,
				beta : 0
			}
		},
		title : {
			text : ''
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
						return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2) + ' %';
					}
				}
			}
		},
		series : [ {
			type : 'pie',
			name : '主题',
			data : pieData
		} ]
	});
}
// 舆情site分布内容
function SiteDisDisplay() {
	$.ajaxSettings.async = false;
	var siteName = new Array();
	var siteCount = new Array();
	var SiteDisHtml = '';
	var url = '../../handler/epostat/statByMetaSearch';
	$.post(url, params, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			var i = 0;
			var listHtml = "</br></br>";
			for (i in resultData) {
				siteName[i] = resultData[i].indicator;
				siteCount[i] = resultData[i].count;
				listHtml = listHtml + "<li>网站:<a>" + siteName[i] + "</a>—<a>" + siteCount[i] + "</a> 条</li><br>";
			}
			SiteDisHtml = "<ul>" + listHtml + "</ul>";
		} else
			SiteDisHtml = "没有相关数据";
		$("#SiteDisDesc").html(SiteDisHtml);
	});
	var categories = siteName, data = siteCount;
	$('#SiteDisChart').highcharts({
		chart : {
			plotBackgroundColor : "#FFFFFF",
			type : 'column'
		},
		title : {
			text : '网站分布'
		},
		xAxis : {
			categories : categories,
			labels : {
				formatter : function() {
					return this.value;
					// return this.value.substr(0, 5);
				}
			}
		},
		yAxis : {
			title : {
				text : '采集条数'
			}
		},
		plotOptions : {
			column : {
				cursor : 'pointer',
				dataLabels : {
					enabled : true,
					style : {
						fontWeight : 'bold'
					},
					formatter : function() {
						return this.y;
					}
				}
			}
		},
		tooltip : {
			formatter : function() {
				point = this.point, s = this.x + ':<b>' + this.y + '';
				return s;
			}
		},
		series : [ {
			name : "网站分布",
			data : data,
			color : '#336699'
		} ]
	}).highcharts(); // return chart
}
// 绑定搜索按钮操作
function bindSearch() {
	$('#search').click(function() {
		$('#tab1').show();
		$('#tab2').show();
		params.startTime = $('#begintime').val() + ":00";
		params.endTime = $('#endtime').val() + ":00";
		params.topNum = 10;
		recentDays = "";
		params.recentDays = "";
		titlHtml();
		TimeDisDisplay();
		OutlineDisplay();
		TopicDisDisplay();
		SiteDisDisplay();
		if (showType == 1) {
			$('#tab1').hide();
		} else if (showType == 0) {
			$('#tab2').hide();
		}
		return false;
	});
}
// 绑定搜索按钮操作
function SearchResult(obj) {
	$('#tab1').show();
	$('#tab2').show();
	$.ajaxSettings.async = false;
	// /active
	var columnId = obj.id;
	if (columnId > 0) {
		$("#subCols").find('li').each(function() {
			$(this).removeClass();
		});
		$("#time" + columnId + "").attr("class", "active"); // 添加菜单选中样式
	}
	// /
	recentDays = obj.id;
	var nowDate = new Date();
	endTime = nowDate.getFullYear() + "-" + (parseInt(nowDate.getMonth()) + 1) + "-" + nowDate.getDate() + " "
			+ nowDate.toLocaleTimeString();
	var beginDate = new Date();
	var beforDate = nowDate.getTime() - recentDays * 24 * 60 * 60 * 1000;
	beginDate.setTime(beforDate);
	startTime = beginDate.getFullYear() + "-" + (parseInt(beginDate.getMonth()) + 1) + "-" + beginDate.getDate()
			+ " 00:00:00";
	params.recentDays = recentDays;
	params.startTime = startTime;
	params.endTime = endTime;
	params.topNum = 10;
	TimeDisDisplay();
	OutlineDisplay();
	TopicDisDisplay();
	if (showType != 1) {
		SiteDisDisplay();
	}
	if (showType == 1) {
		$('#tab1').hide();
	} else if (showType == 0) {
		$('#tab2').hide();
	}
	titlHtml();
	$("#searchByTime").hide();
	return false;
}
// 绑定搜索按钮操作
function TimeSearchResult(obj) {
	$('#tab1').show();
	$('#tab2').show();
	// /active
	var columnId = obj.id;
	if (columnId > 0) {
		$("#subCols").find('li').each(function() {
			$(this).removeClass();
		});
		$("#time" + columnId + "").attr("class", "active"); // 添加菜单选中样式
	}
	// /
	recentDays = "";
	$("#searchByTime").show();
	if (showType == 1) {
		$('#tab1').hide();
	} else if (showType == 0) {
		$('#tab2').hide();
	}
	return false;
}
function titlHtml() {
	var $title = $("#title");
	if (showType == 1) {
		$title = $("#weiboTitle");
	}
	$title.empty();
	/*
	 * if (recentDays == 1) { $title.append("今日舆情统计报表 "); } else if (recentDays ==
	 * 2) { $title.append("最近两日舆情统计报表 "); } else if (recentDays == 7) {
	 * $title.append("最近一周舆情统计报表 "); } else if (recentDays == 14) {
	 * $title.append("最近两周舆情统计报表 "); } else if (recentDays == 30) {
	 * $title.append("最近一月舆情统计报表 "); } else if (recentDays == 60) {
	 * $title.append("最近两月舆情统计报表 "); } else if (recentDays == "") { if (showType ==
	 * 1) { $("#weiboTitle").empty();
	 * $("#weiboTitle").append($('#begintime').val() + "到" + $('#endtime').val() +
	 * "舆情统计报表 "); } else { $("#title").empty();
	 * $("#title").append($('#begintime').val() + "到" + $('#endtime').val() +
	 * "舆情统计报表 "); } }
	 */
	var timeHtml = "从  <a><strong>" + params.startTime + "</strong></a>到  <a><strong>" + params.endTime
			+ "</strong></a>间 的舆情统计报表";
	$title.append(timeHtml);
}
function weiboShow() {
	$.ajaxSettings.async = false;
	showType = 1;
	titlHtml();
	$('#tab1').hide();
	$('#tab2').show();
}
function pageShow() {
	$.ajaxSettings.async = false;
	showType = 0;
	titlHtml();
	$('#tab2').hide();
	$('#tab1').show();
}