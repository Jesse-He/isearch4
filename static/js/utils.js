/**
 * 工具js
 * 
 */

// 快速调转到目标位置
function moveto(thetop) {
	$("html:not(:animated),body:not(:animated)").animate({
		scrollTop : thetop
	}, 500);
}

// 获取url中的参数
function getRequest(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

// 格式化标题长度
function titleFormat(titlestr, length) {
	var r = /[^\x00-\xff]/g;
	var tmp_str = titlestr.replace(r, "**");
	length = length * 2;
	if (tmp_str.length > length) {
		var m = Math.floor(length / 2);
		for ( var i = m; i < titlestr.length; i++) {
			if (titlestr.substr(0, i).replace(r, "**").length >= (length - 1))
				return titlestr.substr(0, i) + "..";
		}
	}
	return titlestr;
}

// 秒转换为分钟
function sec2min(second) {
	var minstr = Math.floor(second / 60) + ":";
	var strsec = second % 60;
	if (strsec < 10)
		strsec = "0" + strsec;
	minstr = minstr + strsec;
	return minstr;
}

function backToTop() {
	// back to top
	$("img.lazy").unveil();
	$("#start-intro").click(function() {
		bootstro.start();
	});
	$.scrollUp({
		scrollName : 'scrollUp', // Element ID
		topDistance : '300', // Distance from top before showing element (px)
		topSpeed : 300, // Speed back to top (ms)
		animation : 'fade', // Fade, slide, none
		animationInSpeed : 200, // Animation in speed (ms)
		animationOutSpeed : 200, // Animation out speed (ms)
		scrollText : '', // Text for element
		activeOverlay : false
	// Set CSS color to display scrollUp active point, e.g '#00FFFF'
	});
}
function timepicker(idName) {
	// 新的时间插件显示示例
	$('#' + idName).datetimepicker({
		language : "zh-CN",
		autoclose : 1, // 时间选择完成后，不自动关闭datetimepicker
		todayBtn : 1,
		weekStart : 1, // 一周日期以周一为第一天
		todayHighlight : 1,
		startView : 2, // 日期时间选择器打开之后首先显示的视图为：一年的12个月
		minView : 2, // 时间选择精确到：年月日
		forceParse : 1,
		// 如果用户输入不正确的日期，强行解析用户输入的日期
		pickerPosition : "bottom-left"
	});
}
function infoNotice(state, header, message) {
	var classes = 'alert alert-' + state;
	var infoHtml = "";
	// 消息框被关闭后，存在，需要重新创建
	infoHtml = "<div id='infomsg' class='" + classes + "'>" + "<a class='close' data-dismiss='alert'>×</a>"
			+ "<h4 class='alert-heading'>" + header + "</h4><p>" + message + "</p></div>";
	$('#infomsg').html(infoHtml);
}
// 修改增加 操作结果提示
function infoEditNotice(state, header, message) {
	$('#editInfomsg').empty();
	var classes = 'alert alert-' + state;
	var infoHtml = "";
	// 消息框被关闭后，存在，需要重新创建
	infoHtml = "<div id='infomsg' class='" + classes + "'>" + "<a class='close' data-dismiss='alert'>×</a>"
			+ "<h4 class='alert-heading'>" + header + "</h4><p>" + message + "</p></div>";
	$('#editInfomsg').html(infoHtml);
}
/**
 * 添加 删除按钮等链接 onclick函數 html :要链接的地址，colIds為包含栏目id的字符串
 */
function buttonHtml(html) {
	var url = window.location.href;
	if (url.indexOf("firstCol") >= 0) {
		var colIds = url.substring(url.indexOf("?firstCol"), url.length);
		window.location.href = html + colIds;
	}
}
// 获取url后面的ids
function urlColHtml() {
	var url = window.location.href;
	if (url.indexOf("firstCol") >= 0) {
		var colIds = url.substring(url.indexOf("firstCol"), url.length);
		return colIds;
	}
}
/**
 * 数字处理，将一个数字变成指定小数位数的字符串 srcNum为原数字，decimalNum为小数位数 author：吴岘辉
 * 
 * @param srcNum
 * @param decimalNum
 * @returns {String}
 */
function numberHandler(srcNum, decimalNum) {
	if (srcNum == null) {
		return "";
	}
	var result = "" + srcNum;
	if (result.length > 0) {
		var dotIndex = result.indexOf(".");
		if (decimalNum <= 0) {
			if (dotIndex >= 0) {
				result = result.substring(0, dotIndex);
			}
		} else {
			if (dotIndex >= 0) {
				var temp = result.length - dotIndex - 1;
				if (temp > decimalNum) {
					result = result.substring(0, dotIndex + decimalNum + 1);
				} else if (temp < decimalNum) {
					for ( var i = 0; i < decimalNum - temp; i++) {
						result += "0";
					}
				}
			} else {
				result += ".";
				for ( var i = 0; i < decimalNum; i++) {
					result += "0";
				}
			}
		}

	}
	return result;
}
/**
 * 学生成绩查看弹出框
 * 
 * @param name
 *            学习模块名称
 * @param aEvmePattern
 *            考核比重
 * @param aevmeThrehold
 *            满分要求
 * @param unit
 *            单位（次/分钟/分）
 * @param StudySituation
 *            学习情况
 * @param realStudySituation
 *            折算后的分数 author：郭海蓉
 */
var tableContentselecte = "";
function showStudySituation(name, aEvmePattern, aevmeThrehold, unit, StudySituation, realStudySituation) {
	if (aEvmePattern == 0) {
		tableContentselecte += "<tr>" + "<td>" + name + "</td>" + "<td>—</td>" + "<td>—</td>" + "<td>—</td>"
				+ "<td>—</td>" + "</tr>";
	} else {
		tableContentselecte += "<tr>" + "<td>" + name + "</td>" + "<td>" + aEvmePattern + "%</td>" + "<td>"
				+ aevmeThrehold + unit + "</td>" + "<td>" + StudySituation + unit + "</td>" + "<td>"
				+ numberHandler(realStudySituation, 2) + "</td>" + "</tr>";
	}
}
/**
 * 字符串截短
 * 
 * @param source
 *            原字符串
 * @param seperator
 *            分隔符
 * @param num
 *            保留的子项个数
 */
function stringTruncate(source, seperator, num) {
	if (source == null) {
		return "";
	}
	if (seperator == null || num <= 0) {
		return source;
	}
	seperator += "";
	var items = source.split(seperator);
	if (items == null || items.length <= num) {
		return source;
	}
	var result = "";
	for ( var i = 0; i < num && i < items.length; i++) {
		result += items[i] + seperator;
	}
	result += "...";
	return result;
}