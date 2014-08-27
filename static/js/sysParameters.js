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
	showUserInfo1(getSysParam());
	$("#remark-info").click(changeInfo);
	$("#sysParmSave").click(function() {
		var syId1 = $("input").eq(0).attr('id');
		var syValue1 = $("input").eq(0).attr('value');
		var syId2 = $("textarea").eq(0).attr('id');
		var syValue2 = $("textarea").eq(0).attr('value');
		$.post('../../handler/systemparameter/modSysParam', {
			"sypaId1" : syId1,
			"sypaValue1" : syValue1,
			"sypaId2" : syId2,
			"sypaValue2" : syValue2
		}, function(data) {
			var res = data.data.data;
			if (res == 1) {
				var str = "system=" + fristPage + "$" + escape(syValue2);
				var date = new Date();
				var ms = 24 * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString();
				document.cookie = str;
				alert("修改成功");
				window.location="sysParameters.html?firstColuId=6&secondColuId=14"; 
			} else {
				alert("未修改成功");
			}
		});
	});
	// checkbyvalue(fristPage);//初始化页码
});
/**
 * 获取初始数据
 */
function getSysParam() {
	var getdata = "";
	$.post('../../handler/systemparameter/querySysParam', {

	}, function(data) {
		getdata = data.data.data;
	});
	return getdata;
}
/**
 * 展示用户信息
 * 
 * @author anny
 * @param data
 */
function showUserInfo1(backInfo) {
	var data = backInfo;
	if (null != data) {
		var i = 0;
		$.each(data, function(entryIndex, entry) {
			var id = "#info-item" + i;
			var rowhtml = "";
			if (i == 1) {
				rowhtml = "<textarea  rows='8' id='" + entry.sypaId + "' readonly='readonly' value='"
						+ entry.sypaValue + "'>" + entry.sypaValue + "</textarea><span class='help-inline info' >"
						+ entry.sypaRemark + "</span>";
			} else {
				rowhtml = "<input id='" + entry.sypaId + "' type='text' readonly='readonly' value='" + entry.sypaValue
						+ "'><span class='help-inline info' >" + entry.sypaRemark + "</span>";
			}
			$(id).html(rowhtml);
			i = i + 1;
		});
	}
}
/**
 * 修改用户信息，界面上发生的变化
 */
function changeInfo() {
	$("#remark-info").html("<i class='icon-pencil icon-white'></i>正在修改");
	$("input").each(function(index) {
		$(this).removeAttr("readonly");
	});
	$("textarea").each(function(index) {
		$(this).removeAttr("readonly");
	});
	$("#postfile").attr("style", "padding-top:100px;");
	$("#sysParmSave").removeAttr("style").css("text-align", "center");
	$("span").filter("[class='info']").html("可编辑").css("color", "green").css("font-size", "15px");
}