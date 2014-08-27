var viewaction = '';// 分页请求的action
var params;// 请求的参数
var synonymId = 0;// 请求的参数
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
	showSynonym();
	//
	// 点击添加，清空信息
	addSynonymButton();
	$('#saveSynonym').click(function() {
		if (operateType == "add") {
			$('#information').empty();
			addSynonym();
		} else if (operateType = "edit") {
			$('#information').empty();
			editSynonym();
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
function showSynonym() {
	viewaction = '../../handler/synonym/synonymQuery';
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
	var synonymDisplayHtml = '';
	synonymDisplayHtml = "<table  class='table table-bordered table-hover'>"
			+ "<thead><tr><th>序</th><th>主关键词</th><th>同义词</th>";
	if (role == 1) {
		synonymDisplayHtml += "<th>操作</th>";
	}
	synonymDisplayHtml += "</tr></thead><tbody>";
	if (pageRecords.data.length == 0) {
		$('#dataArea')
				.empty()
				.append(
						"<tr><td colspan=\"10\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i><strong>没有相关结果！</strong></td></tr>");
	} else {
		$.each(pageRecords.data, function(itemIndex, item) {
			synonymDisplayHtml += "<tr class=''><td class='tdcenter'>" + startIndex + "</td>"
					+ "<td class='tdcenter'><a id='" + item.synonymId + "' name='" + item.synonym + "' words='"
					+ item.synonymWords
					+ "' href='#addSynonym' data-toggle='modal' onclick='javascript:editModal(this);' >" + item.synonym
					+ "</a></td><td class='tdcenter'>" + item.synonymWords + "</td>";
			if (role == 1) {
				synonymDisplayHtml += "<td class='tdcenter'><a id='del" + item.synonymId
						+ "' class='action btn-del' title='点击删除' style='cursor:pointer;' onclick='delSynonym(this);'></a></td>";
			}
			synonymDisplayHtml += "</tr>";
			startIndex = startIndex + 1;
		});
		synonymDisplayHtml += "</tbody></table>";
	}
	$('#dataArea').append(synonymDisplayHtml);
	return false;
}
function delSynonym(obj) {
	if (confirm("请确认是否删除！")) {
		$('#delInfo').empty();
		var synonymId = obj.id.replace("del", "");
		// 显示topic信息
		var url = "../../handler/synonym/delSynonym";
		$.post(url, {
			"synonymId" : synonymId
		}, function(data) {
			var informationHtml = "";
			if (data.ret) {
				if (data.data.result == "success") {
					informationHtml += "<div class='alert alert-success'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>删除成功!</h4> <strong>同义词删除成功!</strong>";
				} else if (data.data.result == "fail") {
					informationHtml += "<div class='alert alert-error'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>删除失败!</h4> <strong>同义词删除失败!</strong>";
				}
			} else {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>删除失败!</h4> <strong>同义词删除失败!</strong>";
			}
			informationHtml += "</div>";
			$('#delInfo').append(informationHtml);
		});
		initSearch();
		return false;
	}
}
function addSynonymButton() {
	$('#information').empty();
	$('#myModalLabel').html("添加监测同义词典");
	$('#synonym').val("");
	$('#synonymWords').val("");
	operateType = "add";
}
// 传递增加同义词数据
function addSynonym() {
	var url = "../../handler/synonym/addSynonym";
	var informationHtml = "";
	var synonym = $('#synonym').val();
	var synonymWords = $('#synonymWords').val();
	if (synonym == null || synonymWords == null || synonymWords.length <= 0 || synonym.length <= 0) {
		informationHtml += "<div class='alert alert-info'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>失败!</h4> <strong>主关键词和同义词皆不能为空，请填写可以识别的同义词!</strong></div>";
		$('#information').append(informationHtml);
		return false;
	}
	$.post(url, {
		"synonym" : synonym,
		"synonymWords" : synonymWords
	}, function(data) {
		if (data.ret) {
			if (data.data.result == "success") {
				informationHtml += "<div class='alert alert-success'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>成功!</h4> <strong>同义词添加成功!</strong>";
				$('#addSynonym').modal('hide');
			} else if (data.data.result == "isExist") {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>失败!</h4> <strong>输入同义词已经存在!</strong>";
			}
		} else {
			informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>同义词添加失败!</strong>";
		}
		informationHtml += "</div>";
		$('#information').append(informationHtml);
	});
	initSearch();
	return false;
}
// 编辑主题分类
function editModal(obj) {
	synonymId = obj.id;
	var words = $('#' + synonymId).attr("words");
	$('#information').empty();
	$('#myModalLabel').html("修改监测同义词典");
	$('#synonym').val(obj.name);
	$('#synonymWords').val(words);
	operateType = "edit";
}
function editSynonym() {
	var url = "../../handler/synonym/editSynonym";
	var informationHtml = "";
	var synonym = $('#synonym').val();
	var synonymWords = $('#synonymWords').val();
	if (synonymId < 0 || synonym == null || synonymWords == null || synonymWords.length <= 0 || synonym.length <= 0) {
		informationHtml += "<div class='alert alert-info'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>编辑失败!</h4> <strong>主关键词和同义词皆不能为空，请填写可以识别的同义词!</strong></div>";
		$('#information').append(informationHtml);
		return false;
	}
	$.post(url, {
		"synonymId" : synonymId,
		"synonym" : synonym,
		"synonymWords" : synonymWords
	}, function(data) {
		if (data.ret) {
			if (data.data.result == "success") {
				informationHtml += "<div class='alert alert-success'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>成功!</h4> <strong>同义词编辑成功!</strong>";
				$('#addSynonym').modal('hide');
			} else if (data.data.result == "isExist") {
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>失败!</h4> <strong>输入同义词已经存在!</strong>";
			}
		} else {
			informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>同义词编辑失败!</strong>";
		}
		informationHtml += "</div>";
		$('#information').append(informationHtml);
	});
	initSearch();
	return false;
}