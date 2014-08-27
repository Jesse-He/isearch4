var params;// 请求的参数
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var recentDays = "";
var days = '';// 查询的天数。0表示选择的是时间段
var topNum = '';// 查询top "number" : 10
var viewaction = '';// 分页请求的action
var attrlevel = "";// 关注水平
var sentiment = "";
var metaSearch = "";
var topic = "";
var warn = "";
$(document).ready(function() {
	backToTop();// back To Top
	$('#newWeiBo').hover(function() {
		$('#newWeiBo').popover('toggle');
	});
	$('#newInfo').hover(function() {
		$('#newInfo').popover('toggle');
	});
	$('#importantInfo').hover(function() {
		$('#importantInfo').popover('toggle');
	});
	$('#hotspotsInfo').hover(function() {
		$('#hotspotsInfo').popover('toggle');
	});
	$('#warningInfo').hover(function() {
		$('#warningInfo').popover('toggle');
	});
	params = {
		"recentDays" : 1,
		"topNum" : 10
	};
	// 显示weibo部分
	weiboDisplay(1);
	// 显示今日提醒
	todayDisplay();
	// 显示时间段分布
	timedistrDisplay();
	// 显示主题分布
	topicdistrDisplay();
	// 显示网址分布
	sitedistrDisplay();
	// 显示关注部分
	AttentionDisplay();
	// 显示预警舆情
	warninfoDisplay();
	// 显示舆情词云
	showkeywordCloud();
	//
	msgmove();
	$("#oUl ul").hover(function() {
		$(this).attr("name", "hovered"); // 鼠标经过设置ul的name值为"hovered"
	}, function() {
		$(this).removeAttr("name");
	});
	// /
});
// /
function msgmove() {
	var isIE = !!window.ActiveXObject;
	var isIE6 = isIE && !window.XMLHttpRequest;
	if ($("#oUl ul").attr("name") != "hovered") {
		// 判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
		var height = $("#oUl li:last").height();
		if (isIE6) {
			// 判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
			// 所以在ie6中实行透明的禁用。
			$("#oUl li:last").css({
				"height" : 0
			});
		} else {
			$("#oUl li:last").css({
				"opacity" : 0,
				"height" : 0
			});
			// 列表最后的li透明和高度设置为0
		}
		$("#oUl li:first").before($("#oUl li:last"));
		// 把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
		$("#oUl li:first").animate({
			"height" : height
		}, 300);
		// 列表顶部的li高度逐渐变高以把下面的li推下去
		if (!isIE6) {
			$("#oUl li:first").animate({
				"opacity" : "1"
			}, 300);
			// 在非IE6浏览器中设置透明淡入效果
		}
	}
	setTimeout("msgmove()", 4000);
	// 设置5秒滚动一次
}

// 显示今日和重点关注(显示今日的所有跟该用户关注的主题相关的)//热点排行
function AttentionDisplay() {
	// 今日关注
	var url = '../../handler/epoquery/query';
	$.post(url, {
		"recentDays" : 1,
		"orderField" : 1
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			var content1 = "";
			var content2 = "";
			$.each(resultData[0].data, function(entryIndex, entry) {
				if (entry.same) {
					content1 = content1 + "<li><a target='_blank' href=\"" + entry.url + "\" title=\"" + entry.title
							+ "\">" + entry.title.substring(0, 33) + "..</a><span class='pull-right'>"
							+ entry.pubTime.substring(0, 16) + "</span></li>";
				} else {
					content2 = content2 + "<li><a target='_blank' href=\"" + entry.url + "\" title=\"" + entry.title
							+ "\">" + entry.title.substring(0, 33) + "..</a><span class='pull-right'>"
							+ entry.pubTime.substring(0, 16) + "</span></li>";
				}
			});
			$("#todayAttention").append(content1 + content2);
		} else {
			$("#todayAttention").append("没有相关数据");
		}
	});
	// 重点关注
	$.post(url, {
		"attentionLevel" : 3,
		"recentDays" : 1,
		"orderField" : 1
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			var content1 = "";
			var content2 = "";
			$.each(resultData[0].data, function(entryIndex, entry) {
				if (entry.same) {
					content1 = content1 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				} else {
					content2 = content2 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				}

			});
			$("#focusAttention").append(content1 + content2);
		} else {
			$("#focusAttention").append("没有相关数据");
		}
	});
	// 热点排行
	$.post(url, {
		"recentDays" : 1,
		"orderField" : 4
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			var content1 = "";
			var content2 = "";
			$.each(resultData[0].data, function(entryIndex, entry) {
				if (entry.same) {
					content1 = content1 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				} else {
					content2 = content2 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				}
			});
			$("#topicHot").append(content1 + content2);
		} else {
			$("#topicHot").append("没有相关数据");
		}
	});
}
// 显示预警舆情部分
function warninfoDisplay() {
	var url = '../../handler/epoquery/query';
	$("#warn").empty();
	warn = -6;
	$.post(url, {
		"warn" : warn
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			var content1 = "";
			var content2 = "";
			$.each(resultData[0].data, function(entryIndex, entry) {
				if (entry.same) {
					content1 = content1 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				} else {
					content2 = content2 + "<li class=\"liststyleforum\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.title + "\">" + entry.title.substring(0, 33)
							+ "..</a><span class='pull-right'>" + entry.pubTime.substring(0, 16) + "</span></li>";
				}
			});
			$("#warn").append(content1 + content2);
		} else {
			$("#warn").append("没有相关数据");
		}
	});
}
// 显示weibo部分
function weiboDisplay(weiboDay) {
	var url = '../../handler/weibo/query';
	$("#oUl").empty();
	var content = "";
	$.post(url, {
		"orderField" : 1,
		"recentDays" : weiboDay
	}, function(data) {
		var resultData = data.data.pageData;
		if (resultData != null) {
			for ( var int = 0; int < resultData.length; int++) {
				$.each(resultData[int].data, function(entryIndex, entry) {
					content = content + "<li class=\"listBorder\"><a target='_blank' href=\"" + entry.url
							+ "\" title=\"" + entry.summerize + "\">" + entry.title.substring(0, 33)
							+ "&nbsp;&nbsp;&nbsp;&nbsp;" + entry.sentiment + "<span class='pull-right'>" + entry.source
							+ "&nbsp;&nbsp;&nbsp;&nbsp;" + entry.pubTime.substring(0, 16) + "</span></a><p>"
							+ entry.summerize + "</p></li>";
				});
				$("#oUl").append(content);
			}
		} else {
			if (weiboDay * 2 < 30) {
				setTimeout("weiboDisplay(" + weiboDay * 2 + ")", 5000);
				$("#oUl").append("最近" + weiboDay * 2 + "天没有相关数据,正在查询其他后面两天的数据，请稍等！");
			}
		}
	});
	setTimeout("weiboDisplay(1)", 150000);
}
// 显示今日提醒
function todayDisplay() {
	$.ajaxSettings.async = false;
	var d1 = "";
	var url1 = '../../handler/user/viewUserInfo';
	$.post(url1, function(data) {
		if (data.ret && data.data.user != null) {
			userInfo = data.data.user;
			d1 = "<h5><i class=\"icon-user\"></i>  <strong>" + userInfo.userTrueName + "</strong> , 您好 </h5>";
		}
	});
	var url2 = "../../handler/epostat/statSum";
	var d2 = "";
	$
			.post(
					url2,
					{
						"recentDays" : 1,
					// "userId":userInfo.userId//当前用户id
					},
					function(data) {
						if (data.data != null && data.data.statData != null) {
							var resultData = data.data.statData;
							var relativeInfo = resultData.attSpecialCount + resultData.attComparCount
									+ resultData.attGeneralCount;
							d2 = d1
									+ "您关注的"
									+ resultData.topicCount
									+ "个主题有<strong>3</strong>条信息:<br>1、今日检测到<a href=\"#\" onclick=\"javascript:detailDisplay('epoquery.html?firstColuId=2','recentDays',1);\"><strong>"
									+ relativeInfo
									+ "</strong></a>条舆情<br>"
									+ "2、今日发现"
									+ "<a href=\"#\" onclick=\"javascript:detailDisplay('epoquery.html?firstColuId=2','warn',-6);\" ><strong>"
									+ resultData.warningCount
									+ "</strong></a>条<a href=\"#\" onclick=\"javascript:detailDisplay('epoquery.html?firstColuId=2','warn',-6);\">预警舆情。</a><br>"
									+ "3、今日发现<a href=\"#\" onclick=\"javascript:detailDisplay('epoquery.html?firstColuId=2','sentiment',-1);\" ><strong>"
									+ resultData.negCount
									+ "</strong></a>条系统研判为<a href=\"#\" onclick=\"javascript:detailDisplay('epoquery.html?firstColuId=2','sentiment',-1);\">负面舆情</a>";
						}
					});
	$("#welcomemsg").append(d2);
}
// 时间段舆情
function timedistrDisplay() {
	$.ajaxSettings.async = false;
	var areaData = new Array();
	var areaName = new Array();
	// var areaCount = new Array();
	var url = '../../handler/epostat/statByTimeRange';
	$.post(url, {
		"recentDays" : 1
	}, function(data) {
		if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
			var resultData = data.data.statData;
			var i = 0;
			for (i in resultData) {
				var areaA = new Array();
				areaName[i] = resultData[i].timeDesc;
				areaA[0] = resultData[i].timeDesc;
				areaA[1] = resultData[i].count;
				areaData[i] = areaA;
			}
		}
	});
	$('#time-distr').highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF",
		},
		title : {
			text : ''
		},
		xAxis : {
			categories : areaName,
			tickmarkPlacement : 'on',
			title : {
				enabled : false
			},
			labels : {
				step : 3,
				formatter : function() {
					return this.value.substr(11, 2);
				}
			}
		},
		yAxis : {
			min : 0, // 定义最小值
			title : {
				text : '数量'
			}
		},
		tooltip : {
			shared : true,
			valueSuffix : ' 条'
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
			}
		},
		series : [ {
			name : '舆情数',
			data : areaData
		} ]
	});
}
//词云
function showkeywordCloud() {
	$.post("../../handler/epoquery/showKeywords", params, function(data) {
		if (data.data != null && data.data.keywords != null) {
			keywords = data.data.keywords;
		}
	});
	var word_array = keywords;
	$("#topicCloud").empty().jQCloud(word_array);
}
// 主页主题分布显示所有的主题信息
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
	$('#topic-distr').highcharts({
		chart : {
			plotBorderWidth : null,
			plotShadow : true
		},
		title : {
			text : ''
		},
		tooltip : {
			pointFormat : '{series.name}: <b>{point.percentage:.2f}%</b>'
		},
		plotOptions : {
			pie : {
				allowPointSelect : true,
				cursor : 'pointer',
				dataLabels : {
					enabled : false,
				},
				showInLegend : true
			}
		},
		series : [ {
			type : 'pie',
			name : '百分比',
			data : pieData
		} ]
	});
}
// 网站分布图
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
	$('#site-distr').highcharts({
		chart : {
			plotBorderWidth : 0.2,
			plotShadow : true
		},
		title : {
			text : ''
		},
		xAxis : {
			categories : categories,
			labels : {
				formatter : function() {
					return titleFormat(this.value, 2);
				}
			}

		},
		yAxis : {
			title : {
				text : '数量'
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
			name : '条数',
			data : columnData,
			color : colors[4]
		} ]
	});
}
function detailDisplay(html, parName, value) {
	if (html == "epoquery.html?firstColuId=2" || html == "weibo.html?firstColuId=9") {
		window.location.href = html + "&" + parName + "=" + value + "&recentDays=1";
	} else if (html == "epoquery.html?") {// 预警舆情显示全部
		window.location.href = "epoquery.html?firstColuId=2" + "&" + parName + "=" + value;
	} else {
		window.location.href = html + "&" + parName + "=" + value;
	}
}