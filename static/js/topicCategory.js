var viewaction = '';// 分页请求的action
var params;// 请求的参数
var topicCate;// 主题分类名称
var topicCateId;// 主题分类id
var synonymShow = false;// 是否显示同义词列表
var operateType = '';// 操作类型
$(document).ready(function() {
	$.ajaxSettings.async = false;
	$('#delInfo').empty();
	leftColumShow(4);
	paginationPage();// 键入页码，分页等标识
	// active樣式
	var coluId = getRequest("secondColuId");
	var parentColuId = getRequest("firstColuId");
	$("#topMenu").find('li').each(function() {
		$(this).removeClass();
	});
	$("#coluId" + coluId + "").attr("class", "active"); // 添加菜单选中样式
	$("#firstColuId" + parentColuId + "").attr("class", "active"); // 添加菜单选中样式
	//
	showTopicCate();
	//
	$('#saveTopicCate').click(function() {
		if (operateType == "add") {
			addTopicCate();
		} else if (operateType = "edit") {
			editTopicCate();
		}
	});
	if (role == 1) {
		$("#addButton").show();
	} else {
		$("#addButton").hide();
	}
	checkbyvalue(fristPage);//初始化页码
});
// 主题分类管理
function showTopicCate() {
	viewaction = "../../handler/retopic/allTopicCate";
	params = {
		"pageArray" : new Array(),
		"recordPerPage" : 20
	};
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	return;

}
// 加载数据到数据区域
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	$('#dataArea').empty();
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	var topicCateHtml = "";
	topicCateHtml = "<table  class='table table-bordered table-hover'>" + "<thead><tr><th>序</th><th>主题分类名称</th>";
	if (role == 1) {
		topicCateHtml += "<th>操作</th>";
	}
	topicCateHtml += "</tr></thead><tbody>";
	if (pageRecords.data.length == 0) {
		$('#dataArea')
				.empty()
				.append(
						"<tr><td colspan=\"10\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i><strong>没有相关结果！</strong></td></tr>");
	} else {
		$.each(pageRecords.data, function(itemIndex, item) {
			var topicHtml = ""
				if(role==1){
					topicHtml = "<a id='"+ item.retopic_id + "' name='" + item.retopic_name
					+ "' href='#addTopicCate' data-toggle='modal' onclick='javascript:editModal(this);'>"
					+ item.retopic_name + "</a>";
				}else if(role==0){
					topicHtml = item.retopic_name ;
				}
			
			topicCateHtml += "<tr class=''><td class='tdcenter'>" + startIndex + "</td><td class='tdcenter'>"+topicHtml+"</td>";
			if (role == 1) {
				topicCateHtml += "<td class='tdcenter'><a id='del" + item.retopic_id + "' name='" + item.retopic_name
						+ "' title='点击删除' class='action btn-del' onclick='delTopicCate(this)'></a></td>";
			}
			startIndex = startIndex + 1;
		});
	}
	topicCateHtml += "</tbody></table>";
	$("#dataArea").append(topicCateHtml);
	return;
}
// 清空文本框
function clearText() {
	var text = document.getElementsByTagName("input");
	var textarea = document.getElementsByTagName("textarea");
	for ( var i = 0; i < text.length; i++) {
		if (text[i].type == "text") {
			text[i].value = '';
		}
	}
	for ( var j = 0; j < textarea.length; j++) {
		textarea[j].value = " ";
	}
}
// 编辑主题分类
function editModal(obj) {
	topicCateId = obj.id;
	$('#tcInfo').empty();
	$('#tcModalLabel').html("修改主题分类");
	$('#topicCateName').val(obj.name);
	topicCate = obj.name;
	operateType = "edit";
}
function editTopicCate() {
	$('#tcInfo').empty();
	var topicCateName = $('#topicCateName').val();
	if (topicCateId > 0) {
		if (topicCate == topicCateName) {
			var informationHtml = "";
			informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>主题分类编辑失败!主题分类名称未作修改，请修改！</strong>";
			$('#tcInfo').append(informationHtml);
			return false;
		}
		var url = "../../handler/retopic/editTopicCate";
		$.post(url, {
			"oldName" : topicCate,
			"topicCateName" : topicCateName
		}, function(data) {
			var informationHtml = "";
			if (data.ret) {
				if (data.data.result == "success") {
					informationHtml += "<div class='alert alert-success'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>成功!</h4> <strong>主题分类编辑成功!</strong>";
					$('#addTopicCate').modal('hide');
				} else if (data.data.result == "fail") {
					informationHtml += "<div class='alert alert-error'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>编辑主题分类失败!</h4> <strong>主题分类编辑出故障!</strong>";
				}
			} else {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>失败!</h4> <strong>主题分类编辑失败!</strong>";
			}
			informationHtml += "</div>";
			$('#tcInfo').append(informationHtml);
		});
	}
	showTopicCate();
	return;
}
function addTopCateButton() {
	$('#tcInfo').empty();
	$('#topicCateName').val("");
	$('#tcModalLabel').html("添加主题分类");
	operateType = "add";
}
function addTopicCate() {
	$('#tcInfo').empty();
	$.ajaxSettings.async = false;
	topicCate = $('#topicCateName').val();
	if (topicCate == null || topicCate.length <= 0) {
		var informationHtml = "";
		informationHtml += "<div class='alert alert-error'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>注意!</h4> <strong>主题分类名称不能为空!</strong>";
		$('#tcInfo').append(informationHtml);
		return false;
	}
	var url = "../../handler/retopic/addTopicCate";
	$.post(url, {
		"topicCate" : topicCate
	}, function(data) {
		var informationHtml = "";
		if (data.ret) {
			if (data.data.result == "success") {
				informationHtml += "<div class='alert alert-success'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>成功!</h4> <strong>主题分类添加成功!</strong><br>可以继续输入主题分类进行添加！";
				$('#addTopicCate').modal('hide');
			} else if (data.data.result == "isExist") {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>添加主题分类失败!</h4> <strong>主题分类已经存在!</strong><br>可以继续输入主题分类进行添加！";
			} else if (data.data.result == "fail") {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>添加主题分类失败!</h4> <strong>主题分类添加出故障!</strong><br>可以继续输入主题分类进行添加！";
			}
		} else {
			informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>主题分类添加失败!</strong>";
		}
		informationHtml += ".</div>";
		$('#tcInfo').append(informationHtml);
	});
	showTopicCate();
	return;
}

// 删除主题分类
function delTopicCate(obj) {
	$('#delInfo').empty();
	if (confirm("确定要删除该主题，注意删除主题会删除主题相关数据！")) {
		var reTopicId = obj.id.replace("del", "");
		var cateName = obj.name;
		var url = "../../handler/retopic/delTopicCate";
		$.post(url, {
			"reTopicId" : reTopicId,
			"parentName" : cateName
		}, function(data) {
			var informationHtml = "";
			if (data.ret) {
				if (data.data.result == "success") {
					informationHtml += "<div class='alert alert-success'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>删除成功!</h4> <strong>主题分类删除成功!</strong>";
				} else if (data.data.result == "fail") {
					informationHtml += "<div class='alert alert-error'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>删除失败!</h4> <strong>主题分类删除失败!</strong>";
				} else if (data.data.result == "isChild") {
					informationHtml += "<div class='alert alert-error'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>删除失败!</h4> <strong>主题分类删除失败!</strong>";
				}
			} else {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>删除失败!</h4> <strong>主题分类删除失败</strong>";
			}
			informationHtml += "</div>";
			$('#delInfo').append(informationHtml);
		});
		showTopicCate();
		return;
	} else {
		return false;
	}
}