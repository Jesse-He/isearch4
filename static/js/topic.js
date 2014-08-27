var viewaction = '';// 分页请求的action
var params;// 请求的参数
var topicCate;// 主题分类名称
var operateType = '';
var id = '';
var topicParams = new Object();
$(document).ready(function() {
	leftColumShow(4);
	paginationPage();// 键入页码，分页等标识
	var coluId = getRequest("secondColuId");
	var parentColuId = getRequest("firstColuId");
	$("#topMenu").find('li').each(function() {
		$(this).removeClass();
	});
	$("#coluId" + coluId + "").attr("class", "active"); // 添加菜单选中样式
	$("#firstColuId" + parentColuId + "").attr("class", "active"); // 添加菜单选中样式
	viewaction = '../../handler/topic/viewAllTopicInfor';
	params = {
			"pageArray" : new Array(),
			"recordPerPage" : 20
	};
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	getTopicCate();
	setTopicTime();
	// 主题关注显示
	viewTopicFollow();
	$('#addTopicButton').click(function() {
		operateType = 'add';
	});
	$('#saveTopic').click(function() {
		TopicOperate();
	});
	if (role == 1) {
		$("#addTopicButton").show();
	} else {
		$("#addTopicButton").hide();
	}
	checkbyvalue(fristPage);//初始化页码
});
function setTopicTime() {
	$('#topicStartTime').datetimepicker({
		autoclose : true,
		todayBtn : true,
		minView : 2
	});
	$('#topicEndTime').datetimepicker({
		autoclose : true,
		todayBtn : true,
		minView : 2
	});
}
function setTopicCate(cate) {
	$.ajaxSettings.async = false;
	$("#topicCate").empty();
	var url = "../../handler/retopic/viewAllTopicCate";
	var topicCates = "";
	$.post(url, function(data) {
		$.each(data.data.topicCate, function(itemIndex, item) {
			if (item.retopic_name == cate) {
				topicCates += "<option selected='true' >" + item.retopic_name + "</option>";
			} else {
				topicCates += "<option>" + item.retopic_name + "</option>";
			}
		});
	});
	$("#topicCate").append(topicCates);
}
function getTopicCate() {
	$.ajaxSettings.async = false;
	var url = "../../handler/retopic/viewAllTopicCate";
	var topicCates = "";
	$.post(url, function(data) {
		$.each(data.data.topicCate, function(itemIndex, item) {
			topicCates += "<option>" + item.retopic_name + "</option>";
		});
	});
	$("#topicCate").append(topicCates);
}

//传递主题数据
function TopicOperate() {
	var url = '';
	var topicName = $('#topicname').val();
	var topicAtte = $('#topiclevel').val();
	var topicCateId = $('#topicCate').val();
	var topicCate = $('#topicCate').val();
	var inkeyword = $('#topicinkw').val();
	var exkeyword = $('#topicexkw').val();
	var startTime = $('#topicStartTime').val();
	var endTime = $('#topicEndTime').val();
	var temp = startTime.split("-");
	var startTimeDate = new Date(parseInt(temp[0]), parseInt(temp[1]) - 1, parseInt(temp[2]));
	temp.length = 0;
	temp = endTime.split("-");
	var endTimeDate = new Date(parseInt(temp[0]), parseInt(temp[1]) - 1, parseInt(temp[2]));
	var informationHtml = "";
	$('#tInfo').empty();
	var temp1 = startTime.replace(/\-/g, "");
	var temp2 = endTime.replace(/\-/g, "");
	if (topicName == null || topicName.length <= 0) {
		informationHtml += "<div class='alert alert-info'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>注意!</h4> <strong>主题名字不能为空</strong>";
		$('#tInfo').append(informationHtml);
		return false;
	}
	if (inkeyword == null || inkeyword.length <= 0) {
		informationHtml += "<div class='alert alert-info'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>注意!</h4> <strong>包含关键字不能为空</strong>";
		$('#tInfo').append(informationHtml);
		return false;
	}
	if (temp1 >= temp2) {
		informationHtml += "<div class='alert alert-info'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>注意!</h4> <strong>监测主题起始时间小于截止时间</strong>";
		$('#tInfo').append(informationHtml);
		return false;
	}
	if (operateType == "add") {
		url = "../../handler/topic/addTopic";
		topicParams = {
				"topicName" : topicName,
				"topicAtte" : topicAtte,
				"topicCate" : topicCate,
				"inkeyword" : inkeyword,
				"exkeyword" : exkeyword,
				"startTime" : startTimeDate,
				"endTime" : endTimeDate
		};
	} else if (operateType == "edit") {
		url = "../../handler/topic/editTopic";
		topicParams = {
				"topicId" : id,
				"topicName" : topicName,
				"topicAtte" : topicAtte,
				"topicCate" : topicCate,
				"inkeyword" : inkeyword,
				"exkeyword" : exkeyword,
				"startTime" : startTimeDate,
				"endTime" : endTimeDate
		};
	}
	$.post(url, topicParams, function(data) {
		var informationHtml = "";
		if (data.ret) {
			if (data.data.result == "success") {
				informationHtml = "<div class='alert alert-success'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>成 功!</h4> <strong>监测主题操作成功!</strong>";
				$('#addTopic').modal('hide');
			} else {
				informationHtml = "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>监测主题操作失败!</strong>";
			}
		} else {
			informationHtml = "<div class='alert alert-error'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>失败!</h4> <strong>监测主题操作失败!</strong>";
		}
		informationHtml += "</div>";
		$("#tInfo").append(informationHtml);
	});
	initSearch();
	// 主题关注显示
	viewTopicFollow();
	return false;
}
function initialDateArea() {
	$("#dataArea").empty();
	$("#tInfo").empty();
	$("#addArea").empty();
	$("#data").hide();
}
//加载数据到数据区域
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	$("#dataArea").empty();
	$("#data").show();
	var $records = $("#dataArea");
	var topicDisplayHtml = '';
	topicDisplayHtml = ""
		+ "<table  class='table table-bordered table-hover ' id='data'>"
		+ "<thead><tr class='info'><th>序</th><th>名称</th><th>分类</th><th>必须包含</th><th>不包含</th><th>起始时间</th><th>截止时间</th><th>关注度</th><th>操作</th></tr>"
		+ "</thead><tbody>";
	if (pageRecords.data.length == 0) {
		$records
		.append("<tr><td colspan=\"10\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i><strong>没有相关结果！</strong></td></tr>");
	} else {
		$.each(pageRecords.data, function(itemIndex, item) {
			var atte = "一般关注";
			if (item.topicAtte == 3)
				atte = "非常关注";
			else if (item.topicAtte == 2)
				atte = "比较关注";
			var topicHtml = ""
				if(role==1){
					topicHtml ="<a id='edit" + item.topicId
					+ "' href='#addTopic' data-toggle='modal' onclick='editTopicParam(this) '>"
					+ "<i class='icon-pencil icon-white'></i>" + item.topicName
					+ "</a>";
				}else if(role==0){
					topicHtml = item.topicName;
				}
			topicDisplayHtml += "<tr id='" + item.topicId + "'><td class='tdcenter'>" + startIndex + "</td>"
			+ "<td class='tdcenter' id='name'>"+topicHtml+"</td><td class='tdcenter' id='cate'>" + item.topicCate + "</td>"
			+ "<td class='tdcenter' id='inkw'>" + item.inkeyword + "</td><td class='tdcenter' id='exkw'>"
			+ item.exkeyword + "</td><td class='tdcenter' id='startTime'>" + item.sStartTime
			+ "</td><td class='tdcenter' id='endTime'>" + item.sEndTime + "</td>"
			+ "<td class='tdcenter' id='atte'>" + atte + "</td><td class='tdcenter'>";
			if (role == 1) {
				topicDisplayHtml += "<a href='#' id='del" + item.topicId
				+ "' class='action btn-del' title='点击删除' onclick='delTopic(this)'></a>";
			}
			topicDisplayHtml += "<a href='#' id='follow" + item.topicId
			+ "' class='action btn-love' title='点击关注' href='#' onclick='followTopic(this);'></a></td></tr>";
			startIndex = startIndex + 1;
		});
		topicDisplayHtml += "</tbody></table>";
	}
	$('#dataArea').append(topicDisplayHtml);
	return false;
}

function delTopic(obj) {
	if (confirm("确定要删除该主题，注意删除主题会删除主题相关数据！")) {
		var informationHtml = "<div class='alert alert-error'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>正在删除主题中，请勿关闭当前页面！</h4> <img src=\"../img/loading-topic.gif\"/>";
		$('#tInfo1').append(informationHtml);
		var topicId = obj.id.replace("del", "");
		var url = "../../handler/topic/delTopic";
		$.post(url, {
			"topicId" : topicId
		}, function(data) {
			$('#tInfo1').remove();
			informationHtml = "";
			if (data.ret) {
				if (data.data.result == "success") {
					informationHtml += "<div class='alert alert-success'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>删除成功!</h4> <strong>主题删除成功!</strong>";
				} else if (data.data.result == "fail") {
					informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>删除失败!</h4> <strong>主题删除失败!</strong>";
				}
			} else {
				informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>主题删除失败!</strong>";
			}
			informationHtml += "</div>";
			$('#tInfo11').append(informationHtml);
		});
		initSearch();
		// 主题关注显示
		viewTopicFollow();
	} else
		return false;
}
///编辑topic
function editTopicParam(obj) {
	id = obj.id.replace("edit", "");
	operateType = "edit";
	var $temp = $("#" + id).children();
	var topicParam = new Array();
	for ( var i = 0; i < $temp.length - 1; i++) {
		topicParam[i] = $temp.eq(i).text();
	}
	$('#tInfo').empty();
	$('#tModalLabel').html("修改主题");
	$('#topicname').val(topicParam[1]);
	$('#topicinkw').val(topicParam[3]);
	$('#topicexkw').val(topicParam[4]);
	$('#topicStartTime').val(topicParam[5]);
	$('#topicEndTime').val(topicParam[6]);
	paramChange(topicParam[2], topicParam[7]);
	$("#topicCate").attr("disabled","disabled");
}
function setTitle() {
	$("#tInfo").empty();
	$('#tModalLabel').html("添加主题");
	clearText();
	$("#topicCate").removeAttr("disabled");
}
function paramChange(cate, level) {
	if (level == "一般关注") {
		$('#topiclevel').val(1);
	} else if (level == "比较关注") {
		$('#topiclevel').val(2);
	} else if (level == "特别关注") {
		$('#topiclevel').val(3);
	}
	setTopicCate(cate);
}
function viewTopicFollow() {
	$.ajaxSettings.async = false;
	var url = "../../handler/topicFollow/viewUserTopic";
	$.post(url, function(data) {
		if (data.ret) {
			$.each(data.data.followIds, function(itemIndex, item) {
				$("#follow" + item).attr("class", "action btn-love loved");
				$("#follow" + item).attr("title", "已关注,点击取消关注");
				// $("#follow" + item).html("已关注");
			});
		}
	});
	return;
}
function followTopic(obj) {
	var id = obj.id;
	var relid = obj.id.replace("follow", "");
	if ($("#" + id).attr("class") == "action btn-love loved") {
		// 取消关注
		var url = "../../handler/topicFollow/cancleFollow";
		$.post(url, {
			"topicId" : relid
		}, function(data) {
			if (data.ret && data.data.result) {
				$("#" + id).attr("class", "action btn-love");
				$("#" + id).attr("title", "点击关注");
				// $("#" + id).html("+关注");
			}
		});
	} else {
		// 添加关注
		var url = "../../handler/topicFollow/addFollow";
		$.post(url, {
			"topicId" : relid
		}, function(data) {
			if (data.ret && data.data.result) {
				$("#" + id).attr("class", "action btn-love loved");
				$("#" + id).attr("title", "已关注,点击取消关注");
				// $("#" + id).html("已关注");
			}
		});
	}
	return;
	// viewTopicFollow();
}