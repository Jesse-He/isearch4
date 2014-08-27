var viewaction = '';// 分页请求的action
var params;// 请求的参数
var userParams;// user参数
var option = "";
var id = '';
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
	viewaction = '../../handler/user/viewAllUser';
	paginationPage();// 键入页码，分页等标识
	params = {
			"pageArray" : new Array(),
			"recordPerPage" : 20
	};
	initialBind();// 绑定分页的一些操作响应
	initSearch();
	checkbyvalue(fristPage);//初始化页码
});
//加载数据到数据区域
function refreshContent(pageRecords) {
	$.ajaxSettings.async = false;
	var startIndex = (currentPage - 1) * recordPerPage + 1;
	$("#dataArea").empty();
	var userHtml = "<table  class='table table-condensed table-striped  table-hover'>"
		+ "<thead><tr><th>序</th><th>用户名</th><th>真实姓名</th><th>角色</th><th>操作</th></tr>" + "</thead><tbody>";
	if (pageRecords.data.length == 0) {
		$('#dataArea')
		.append(
		"<tr><td colspan=\"10\" class=\"tdcenter\"><i class=\" icon-warning-sign\"></i><strong>没有相关结果！</strong></td></tr>");
	} else {
		$.each(pageRecords.data, function(itemIndex, item) {
			var userInfo = item.userTrueName + "," + item.role + "," + item.password;
			if(item.role==0){
				item.role = "一般人员";
			}
			if(item.role==1){
				item.role = "管理员";
			}
			userHtml += "<tr class=''><td class='tdcenter'>" + startIndex + "</td>"
			+ "<td class='tdcenter'><a id='userId" + item.userId + "' name='" + item.userName + "' info='"
			+ userInfo + "' class='' data-toggle='modal' href='#modUser' onclick='editUserModel(this)'>"
			+ item.userName + "</a>" + "</td><td class='tdcenter'>" + item.userTrueName
			+ "</td><td class='tdcenter'>" + item.role
			+ "</td><td class='tdcenter'><a href=\"javascript:void(0);\" id='del" + item.userId
			+ "'class='action btn-del' type='' onclick='delUser(this);'></a>" + "</td></tr>";
			startIndex = startIndex + 1;
		});
		userHtml += "</tbody></table>";
		$('#dataArea').append(userHtml);
	}
	return false;
}
function delUser(obj) {
	$.ajaxSettings.async = false;
	var userId = obj.id;
	var luserid = userId.length;
	userId = userId.substring(3, luserid);
	if(parseInt(userId)>0){
		$("#delModal").modal({
			'backdrop':true
		});
		$("#delOamanage").click(function(){
			var url = '../../handler/user/delUser';
			$.post(url, {
				"userId" : userId
			}, function(data) {
				var informationHtml = "";
				if (data.ret) {
					if (data.data.result == "success") {
						informationHtml += "<div class='alert alert-success'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>成功!</h4> <strong>用戶刪除成功!</strong>";
					} else if (data.data.result == "fail") {
						informationHtml = "";
						informationHtml += "<div class='alert alert-error'>"
							+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
							+ "<h4>失败!</h4> <strong>用戶刪除失败!</strong>";
					}
				} else {
					informationHtml = "";
					informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>失败!</h4> <strong>用戶刪除失败!</strong>";
				}
				informationHtml += ".</div>";
				$('#delInfo').empty().append(informationHtml);
				$("#delModal").modal('hide');
			});
			initSearch();
			return false;
			
		});
	}else{
		alert("请正确选择要删除的用户！");
	}

}
function addUser() {
	$.ajaxSettings.async = false;
	$('#information').empty();
	var url = '../../handler/user/addUser';
	var userName = $('#userName').val();
	var userTrueName = $('#userTrueName').val();
	var password = $('#password').val();
	var password2 = $('#password2').val();
	var role = $('#role').val();
	if (userName.length <= 0) {
		var informationHtml = "";
		informationHtml += "<div class='alert alert-info'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>注意!</h4> <strong>用戶名不能为空!</strong>";
		$('#information').append(informationHtml);
		return false;
	}
	if (password != password2) {
		var informationHtml = "";
		informationHtml += "<div class='alert alert-info'>"
			+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
			+ "<h4>注意!</h4> <strong>两次密码不同!</strong>";
		$('#information').append(informationHtml);
		return false;
	}
	password = hex_md5(password);
	$.post(url, {
		"userName" : userName,
		"userTrueName" : userTrueName,
		"password" : password,
		"role" : role
	}, function(data) {
		var informationHtml = "";
		if (data.ret) {
			if (data.data.result == "success") {
				informationHtml += "<div class='alert alert-success'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>成功!</h4> <strong>用戶添加成功!</strong>";
			} else if (data.data.result == "fail") {
				informationHtml = "";
				informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>用戶添加失败!</strong>";
			}
		} else {
			informationHtml = "";
			informationHtml += "<div class='alert alert-error'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>失败!</h4> <strong>用戶添加失败!</strong>";
		}
		informationHtml += "</div>";
		$('#information').empty().append(informationHtml);
		location.reload();
	});
	return;
}
function addButtonDown() {
	$("#myModalLabel").empty().append("添加用户");
	$("#userName").removeAttr("readonly");
	$("#userName").removeClass();  
	$("#userName").addClass("input-big"); 
	option = "add";
	clearText();
	return;
}