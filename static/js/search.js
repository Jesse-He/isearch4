var params;// 请求的参数
var startTime = '';// 查询的开始时间
var endTime = '';// 查询的结束时间
var days = '';// 查询的天数。0表示选择的是时间段
var topNum = '';// 查询top "number" : 10
var viewaction = '';// 分页请求的action
$(document).ready(function() {
	// 绑定时间选择
	$('#begintime').datetimepicker();
	$('#endtime').datetimepicker();
	params = {
			"startTime" : "",
			"endTime" : "",
			"query" : "",
			"recentDays" : 0,
			"pageArray" : new Array(),
			"recordPerPage" : 20,
			"sentiment" : "",
			"metaSearch" : "",
			"indexLoc" : "",
			"isPubDate" : ""
	};
	$("#searchTime").hide();
	showMetaColumn();
	// 绑定搜索按钮
	bindSearch();
	//回车键的键值为13  
	document.onkeydown = function (event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if (e && e.keyCode == 13) {
			//to do something;
			document.getElementById("search").click(); //调用登录按钮的登录事件  
		}
	};
});
function bindSearch() {
	$('#search').click(function() {
		getParams();
		if (params.query) {
			var url = "searchresult.html?";
			url += "&" + $.param(params, true);
			$(this).attr('href', url);
		} else {
			alert("请输入检索关键词！");
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
		}
	} else {
		params.startTime = "";
		params.endTime = "";
	}
	params.query = encodeURI($('#keywords').val());
	params.indexLoc = $('#fieldtype').val();
	params.isPubDate = encodeURI($('#datefield').val());
	params.sentiment = GetRadioValue("emotiontype");
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
function timeChange() {
	$('#datetype').val(0);
}