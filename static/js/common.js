var secondColData = new Object();
var userId = 0;
var role = 0;
var userName = "";
var userTrueName = "";
var password = "";
var option = "";
var id = 0;
var fristPage = 0;// 初始页码
var footerInfo = "";// 页脚信息
// 全局权限判断
$(document).ajaxComplete(function(event, XMLHttpRequest, settings) {
	if (XMLHttpRequest.status == "602" || XMLHttpRequest.status == "404") {
		window.location = "login.html";
		return false;
	}
});
$(document).ready(function() {
	// cookie 获取指定名称的cookie的值
	var cookies = document.cookie;
	if (cookies) {
		var cookie = cookies.split("; ");
		for ( var i = 0; i < cookie.length; i++) {
			var temp = cookie[i].split("=");
			if (temp[0] == "user") {
				var iCookie = temp[1].split("$");
				userId = iCookie[0];
				role = iCookie[1];
				userName = unescape(iCookie[2]);
				userTrueName = unescape(iCookie[3]);
				password = unescape(iCookie[4]);
			}
			if (temp[0] == "system") {
				var sysCookie = temp[1].split("$");
				fristPage = sysCookie[0];
				footerInfo = unescape(sysCookie[1]);
			}
		}
		showFooter();
		getSysParam();
	} else {
		getSysParam();
	}
	if (document.URL.indexOf("login.html") < 0) {
		getnavbar();
		moduserHtml();
	}
	showUserInfo();
	$("#logout").click(function() {// 退出
		$.post("../../handler/user/logout", function(data) {
			// 删除cookie
			document.cookie = "user=;expires=" + (new Date(0)).toGMTString();
			alert("退出成功");
		});
	});
	//
	// option button 用户信息修改
	$("#saveButton").click(function() {
		if (option == 'add') {
			addUser();
		} else if (option = "edit") {
			editUser();
		}
	});

});

function getSysParam() {
	// 请求两个参数信息
	$.post("../../handler/systemparameter/querySysParam", function(data) {
		getdata = data.data.data;
		$.each(getdata, function(entryIndex, entry) {
			if (entry.sypaId == 1) {
				fristPage = entry.sypaValue;
			}
			if (entry.sypaId == 2) {
				footerInfo = entry.sypaValue;
			}
			// add cookie
			var str = "system=" + fristPage + "$" + escape(footerInfo);
			var date = new Date();
			var ms = 24 * 3600 * 1000;
			date.setTime(date.getTime() + ms);
			str += "; expires=" + date.toGMTString();
			document.cookie = str;
		});
	});
}
function getcurrentfile() {
	var filestr = document.URL;
	if (filestr.search("html") == -1)
		filestr = "login";
	else
		filestr = filestr.substring(filestr.lastIndexOf('/') + 1, filestr.lastIndexOf('.'));
	coluurl = filestr;
	return filestr;
}
// 显示一级导航
function getnavbar() {
	var currColuId = getRequest("coluId");
	$.ajax({
		type : "POST",
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",// 发送信息至服务器时内容编码类型
		url : '../../handler/column/viewFirstMenu',
		async : false, // 需要同步请求数据
		dataType : 'json',
		success : function(data) {
			var coluDate = data.data.column;
			var navbarMsg = "<ul class=\"nav\">";
			var filepre = getcurrentfile();
			if (filepre.search('-') != -1) {
				filepre = filepre.substring(0, filepre.search('-'));
			}
			$.each(coluDate, function(entrtIndex, entry) {
				if (entry.url == "osmanage.html") {
					if (role == 1) {
						var actstr = "";
						if (entry.id == currColuId || entry.url.indexOf(filepre) == 0) {
							actstr = "active";
						}
						navbarMsg += "<li id='firstColuId" + entry.id + "' class='" + actstr + "'><a href='"
								+ entry.url + "?firstColuId=" + entry.id + "'><i class='" + entry.icon
								+ " icon-white'></i>" + entry.name + "</a> </li>";
					}
				} else {
					var actstr = "";
					if (entry.id == currColuId || entry.url.indexOf(filepre) == 0) {
						actstr = "active";
					}
					navbarMsg += "<li id='firstColuId" + entry.id + "' class='" + actstr + "'><a href='" + entry.url
							+ "?firstColuId=" + entry.id + "'><i class='" + entry.icon + " icon-white'></i>&nbsp;"
							+ entry.name + "</a> </li>";
				}
			});
			// navbarMsg = navbarMsg + "</ul>";
			navbarMsg = navbarMsg + "<li id='userinfo' class='nav nav-pills pull-right'></li></ul>";
			$("#navbar").append(navbarMsg);
		}
	});

	// 显示banner
	var bannerstr = "<div class='logotitle'>互联网舆情监测系统</div>";
	$("#logo").empty().append(bannerstr);
}

// 获取url中的参数
function getRequest(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

// 根据菜单类型构建对应的代码
function leftColumShow(parentId) {
	url = "../../handler/column/viewMenuById";
	$.post(url, {
		"parent" : parentId
	}, function(data) {
		if (data.ret && data.data.column != null) {
			var coluDate = data.data.column;
			var navbarMsg = "<ul class=\"nav nav-pills nav-stacked\">";
			$.each(coluDate, function(entrtIndex, entry) {
				navbarMsg += "<li id=coluId" + entry.id + " class=''> <a href='" + entry.url + "?firstColuId="
						+ parentId + "&secondColuId=" + entry.id + "'>" + entry.name + "</a> </li>";
			});
			navbarMsg = navbarMsg + "</ul>";
			$("#topMenu").append(navbarMsg);
		}
	});
}
// 获取url中的参数
function getRequest(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function loadPage() {
	var fpage = "<div class=\"well\"><div class=\"container-fluid\"><table id='dataArea'"
			+ "class='table table-hover table-striped table-condensed'><thead><tr>"
			+ "<th width='33'><a href='#' id='chooseall'>全选</a></th><th>值</th>"
			+ "<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;舆 情 摘 要 <span class='pull-right'>排序:<select id='listsort'"
			+ "class='selcombobox' style='height: 30px; width: 100px;'"
			+ "name='listsort' onchange='javascript:SearchByOrder(this);'>"
			+ "<option value='1' selected='selected'>按情感值</option>"
			+ "<option value='2'>按发表时间</option>"
			+ "<option value='3'>按采集时间</option>"
			+ "<option value='4'>按热度</option>"
			+ "<option value='5'>按相关度</option>"
			+ "</select></span>	</th></tr></thead><tbody></tbody></table></div></div><div class=\"btn-toolbar\"><div class=\"btn-group\"><button class=\"btn\">当前第</button><button id=\"currentPage\" class=\"btn\"></button>"
			+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"totalPage\" class=\"btn\"></button>"
			+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button id=\"pagebackward\" class=\"btn\">上一页</button>"
			+ "<button id=\"pageforward\" class=\"btn\">下一页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"recordCount\" class=\"btn\"></button>"
			+ "<button class=\"btn\">条</button></div><div class=\"btn-group\"><button class=\"btn\">每页</button><select id=\"recordPage\" class=\"span1 btn\">"
			+ "<option>10</option><option>20</option><option>30</option><option>40</option><option>50</option></select></div><div class=\"btn-group\"><input id=\"gotopage\" type=\"text\" class=\"input-mini btn\">"
			+ "<button id=\"goto\" class=\"btn\">跳转</button></div></div>";
	$("#levelone").append(fpage);
}
/**
 * 初始化select框
 * 
 * @param c
 * @param v
 */

function checkbyvalue(v) {
	for ( var i = 0; i < document.getElementById("recordPage").options.length; i++) {
		if (v == document.getElementById("recordPage").options[i].value) {
			document.getElementById("recordPage").options[i].selected = true;
		}
	}
}
function showFooter() {
	$.ajaxSettings.async = false;
	var footerHtml = "";
	// id=20的为版本信息
	var currdate = new Date();
	var copydate = "2010";
	if (currdate.getFullYear() != copydate)
		copydate = copydate + " - " + currdate.getFullYear();
	// footerString = "西南科技大学 <a
	// href=\"http://www.cs.swust.edu.cn/academic/lab-kownledge.html\">数据与知识工程实验室</a>";
	// salert(footerInfo);
	//footerHtml += " &copy; "  + footerInfo + "";
	footerHtml =  footerInfo + "";
	$("#footer").append(footerHtml);
	return;
}
// 清空文本框
function clearText() {
	var text = document.getElementsByTagName("input");
	var textarea = document.getElementsByTagName("textarea");
	for ( var i = 0; i < text.length; i++) {
		if (text[i].type == "text" || text[i].type == "password") {
			text[i].value = '';
		}
	}
	for ( var j = 0; j < textarea.length; j++) {
		textarea[j].value = " ";
	}
}
// 分页内容
function paginationPage() {
	var pageHtml = "<div class=\"btn-group\"><button class=\"btn\">第</button><button id=\"currentPage\" class=\"btn\"></button><button class=\"btn\">页</button></div><div class=\"btn-group\"><button class=\"btn\">共</button>"
			+ "<button id=\"totalPage\" class=\"btn\"></button>"
			+ "<button class=\"btn\">页</button></div><div class=\"btn-group\"><button id=\"pagebackward\" class=\"btn\">上一页</button><button id=\"pageforward\" class=\"btn\">下一页</button></div>"
			+ "<div class=\"btn-group\"><button class=\"btn\">共</button><button id=\"recordCount\" class=\"btn\"></button><button class=\"btn\">条</button>"
			+ "</div><div class=\"btn-group\"><button class=\"btn\">每页</button><select id=\"recordPage\" class=\"input-mini changePage\"><option>10</option>"
			+ "<option>20</option><option>30</option><option>40</option><option>50</option></select></div>"
			+ "<div class=\"btn-group\"><button id=\"goto\" class=\"btn\">跳转</button><input id=\"gotopage\" type=\"text\" class=\"input-mini changePage\" placeholder=\"页码\"/></div>";
	$("#pagination").html(pageHtml);
}
function showUserInfo() {
	var userInfo = userTrueName + "," + role + "," + password;
	var iHtml = '<li class="dropdown"><a class="dropdown-toggle" href="#" data-toggle="dropdown"><i class=" icon-user icon-white"></i>'
			+ userTrueName
			+ '<strong class="caret"></strong></a>'
			+ '<ul class="dropdown-menu">'
			+ '<li><a id="userId'
			+ userId
			+ '" onclick="editUserModel(this)" href="#modUser" data-toggle="modal" info='
			+ userInfo
			+ ' name='
			+ userName
			+ '><i class="icon-wrench"></i>个人资料</a></li><li class="divider"></li>'
			+ '<li><a id="logout" href="login.html"><i class="icon-off"></i>退出</a></li></ul></li>';
	$("#userinfo").html(iHtml);
}
function moduserHtml() {
	var html = '<div><div id="modUser" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
			+ '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="myModalLabel">添加用户</h3></div>'
			+ '<div class="modal-body"><div id="information"></div><form class="form-horizontal">'
			+ '<div class="control-group"><label class="control-label " for="userName">用户 名</label>'
			+ '<div class="controls"><input id="userName" class="input-big uneditable-input" readonly="readonly" type="text" name="userName"><span class="help-inline">请输入用户的登录名称</span></div></div>'
			+ '<div class="control-group"><label class="control-label" for="userTrueName">用户姓名</label><div class="controls">'
			+ '<input id="userTrueName" class="input-big valid" type="text" data-provide="typeahead" name="userTrueName"> '
			+ '<span class="help-inline">请输入用户的真实名称</span></div></div><div class="control-group"><label class="control-label" for="password">用户密码</label>'
			+ '<div class="controls"><input id="password" class="input-big valid" type="password" name="password"> '
			+ '<span class="help-inline"></span></div></div><div class="control-group"><label class="control-label" for="password2">确认密码</label><div class="controls">'
			+ '<input id="password2" class="input-big valid" type="password" name="password2"> <span class="help-inline"></span></div></div>'
			+ '<div class="control-group"><label class="control-label" for="role">用户角色</label><div class="controls"><select id="role" class="span3"><option value ="0">一般用户</option><option value ="1">管理员</option></select>'
			+ ' <span class="help-inline">用户角色选择</span></div></div></form></div>'
			+ '<div id="operateButton" class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
			+ '<button id="saveButton" class="btn btn-primary">保存</button></div></div></div>';
	$("#footer").after(html);
	if (role == 0) {
		$("#role").attr("disabled", "disabled");
	}
}
function editUser() {
	$.ajaxSettings.async = false;
	$('#information').empty();
	var info = $("#" + htmlId).attr("info").split(",");
	var oldPassword = info[2];
	var password = hex_md5($("#password").val());
	var password2 = hex_md5($("#password2").val());
	if (oldPassword == $("#password").val()) {
		password = $("#password").val();
		password2 = $("#password2").val();
	}
	var url = '../../handler/user/editUser';
	userParams = {
		"userId" : id,
		"userName" : $("#userName").val(),
		"userTrueName" : $("#userTrueName").val(),
		"role" : $("#role").val(),
		"password" : password,
		"password2" : password2
	};
	var informationHtml = "";
	if (userParams.userName.length <= 0) {
		informationHtml += "<div class='alert alert-info'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>注意!</h4> <strong>用戶名不能为空!</strong>";
		$('#information').append(informationHtml);
		return false;
	}
	if (userParams.password != userParams.password2) {
		informationHtml += "<div class='alert alert-info'>"
				+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
				+ "<h4>注意!</h4> <strong>两次密码不同!</strong>";
		$('#information').append(informationHtml);
		return false;
	}
	$.post(url, userParams, function(data) {
		if (data.ret) {
			var resultData = data.data.data;
			if (resultData.result == "success") {
				informationHtml += "<div class='alert alert-success'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>成功!</h4> <strong>用戶编辑成功!</strong>";
				var userData = resultData.user;
				// add cookie
				var str = "user=" + userData.userId + "$" + userData.role + "$" + escape(userData.userName) + "$"
						+ escape(userData.userTrueName) + "$" + escape(userData.password);
				var date = new Date();
				var ms = 24 * 3600 * 1000;
				date.setTime(date.getTime() + ms);
				str += "; expires=" + date.toGMTString();
				document.cookie = str;
			} else if (resultData.result == "fail") {
				informationHtml = "";
				informationHtml += "<div class='alert alert-error'>"
						+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
						+ "<h4>失败!</h4> <strong>用戶编辑失败!</strong>";
			}
		} else {
			informationHtml = "";
			informationHtml += "<div class='alert alert-error'>"
					+ "<button type='button' class='close' data-dismiss='alert'>×</button>"
					+ "<h4>失败!</h4> <strong>用戶编辑失败!</strong>";
		}
		informationHtml += "</div>";
		$('#information').empty().append(informationHtml);
		location.reload();
	});
	return;
}
function editUserModel(obj) {
	option = "edit";
	id = obj.id.replace("userId", "");
	htmlId = obj.id;
	var userName = obj.name;
	var info = $("#" + htmlId).attr("info").split(",");
	$("#myModalLabel").empty().append("修改用户");
	$("#userName").val(userName);
	$("#userTrueName").val(info[0]);
	$("#role").val(info[1]);
	$("#password").val(info[2]);
	$("#password2").val(info[2]);
	return;
}
// 收藏
function collect(obj, type) {
	var value = obj.id.split("t");
	var id = value[1];
	var content = [];
	content = $(obj).attr("value").split("*&&*");
	for ( var i = 0; i < content.length; i++) {
		collectTitle = content[0];
		collectContent = content[1];
		collectSite = content[2];
		collectType = content[3];
		collectCrawlDateStr = content[4];
		collectPubDateStr = content[5];
		collectPolarity = content[6];
		collectUrl = content[7];
		collectTopic = content[8];
		collectAttentionLevel = content[9];
	}
	$(obj).attr("disabled", "disabled");
	if (type == 1) {// 表示网页舆情
		collectWeiBOId = 0;
		collectWebPageId = id;
		collectCrawlDateStr = collectCrawlDateStr + " 00:00:00.0";
		collectPubDateStr = collectPubDateStr + " 00:00:00.0";
	} else if (type == 2) {// 表示微博舆情
		collectWeiBOId = id;
		collectWebPageId = 0;
		collectCrawlDateStr = collectCrawlDateStr + " 00:00:00.0";
		collectPubDateStr = collectPubDateStr + " 00:00:00.0";
	} else if (type == 3) {// 舆情检索中网页舆情的收藏
		collectWeiBOId = 0;
		collectWebPageId = id;
	} else if (type == 4) {// 舆情检索中微博舆情的收藏
		collectWeiBOId = id;
		collectWebPageId = 0;
	}
	$.post("../../handler/collect/hascollect", {
		"collectTitle" : collectTitle,
		"collectContent" : collectContent,
		"collectSite" : collectSite,
		"collectType" : collectType,
		"collectCrawlDateStr" : collectCrawlDateStr,
		"collectPubDateStr" : collectPubDateStr,
		"collectPolarity" : collectPolarity,
		"collectUrl" : collectUrl,
		"collectWeiBOId" : collectWeiBOId,
		"collectWebPageId" : collectWebPageId,
		"collectTopic" : collectTopic,
		"collectAttentionLevel" : collectAttentionLevel
	}, function(result) {
		if (result.ret) {
			$("#collect" + id).text("已收藏");
			// $(obj).attr("disabled", "disabled");
			if (type == 1 || type == 3) {// 表示网页舆情和舆情检索中的网页舆情
				$("#collect" + id).attr("onclick", "javascript:removeCollect(id,1);");
			} else if (type == 2 || type == 4) {// 表示微博舆情和舆情检索中的微博舆情
				$("#collect" + id).attr("onclick", "javascript:removeCollect(id,2);");
			}

		}
	}, "json");
}
// 查询收藏记录
function searchCollect(type) {
	var collectType = 0;
	if (type == 1) {// 表示网页舆情
		collectType = 1;
	} else if (type == 2) {// 表示微博舆情
		collectType = 2;
	}
	$.post("../../handler/collect/isCollect", {
		"collectType" : collectType
	}, function(result) {
		if (result.ret) {
			$.each(result.data.collectIds, function(itemIndex, item) {
				// $("#collect" + item).attr("disabled", "disabled");
				// var ids=result.data.collectIds;
				// alert(item);
				$("#collect" + item).text("已收藏");
				$("#collect" + item).attr("onclick", "javascript:removeCollect('collect" + item + "'," + type + ");");
			});
		}
	}, "json");
}
// 移除收藏
function removeCollect(id, type) {
	var value = id.split("t");
	var id = value[1];
	$.post("../../handler/collect/removeCollect", {
		"ids" : id,
		"type" : type
	}, function(result) {
		if (result.ret) {
			$("#collect" + id).text("收藏");
			$("#collect" + id).attr("onclick", "javascript:collect(this," + type + ");");
		}
	}, "json");
}