var userName = '';
var password = "";
$(document).ready(function() {
	$("#user_name").val("");
	$("#user_password").val("");
	$("#authcode").val("");
	$('#loginbut').click(function() {
		$('#loginInfo').empty();
		userName = $('#user_name').val();
		password = $('#user_password').val();
		authcode = $("#authcode").val();
		if (userName.length <= 0) {
			var informationHtml = "<strong>用户名不能为空!</strong>";
			$('#loginInfo').html(informationHtml);
			return false;
		}
		if (password.length <= 0) {
			var informationHtml = "<strong>密码不能为空!</strong>";
			$('#loginInfo').html(informationHtml);
			return false;
		}
		if (authcode == null || authcode == "") {
			$("#authcode").focus();
			$('#loginInfo').html("<strong> 验证码不能为空!</strong>");
			//return false;
		}
		login();
		return false;
	});
	reloadcode();
});
function login() {
	var informationHtml = "";
	password = hex_md5(password);
	$.ajax({
		type : 'POST',
		contentType : 'application/x-www-form-urlencoded;charset=UTF-8',// 发送信息至服务器时内容编码类型
		url : '../../handler/user/login',
		async : false, // 需要同步请求数据
		data : {
			"userName" : userName,
			"password" : password,
			"authcode" : authcode,
		},
		dataType : 'json',
		success : function(data) {
			if (data.ret) {
				var resultData = data.data.result;
				if (resultData.result == "success") {
					var userData = resultData.user;
					informationHtml = "<strong>正在登陸，請稍等……!</strong>";
					// add cookie
					var str = "user=" + userData.userId + "$" + userData.role + "$" + escape(userData.userName) + "$"
					+ escape(userData.userTrueName) + "$" + escape(userData.password);
					var date = new Date();
					var ms = 24 * 3600 * 1000;
					date.setTime(date.getTime() + ms);
					str += "; expires=" + date.toGMTString();
					document.cookie = str;
					window.location.href = "isearch.html?firstColuId=0";
				} else if (resultData.result == "passwordError") {
					alert("密码错误！");
					informationHtml = "<strong>密码错误!</strong>";
				} else if (resultData.result == "null") {
					alert("该用户不存在!");
					informationHtml = "<strong>该用户不存在!</strong>";
				}
			} else
				alert(data.errmsg);
			informationHtml = "<strong>登录失敗!</strong>";
		}
	});
	$('#loginInfo').html(informationHtml);
	return false;
}
//重新加载验证码
function reloadcode() {
	document.getElementById('imgcode').src = 'checkcode.jsp?' + Math.random();
}
//设置设为首页功能
function SetHome(url){ 
    if (document.all) { 
        document.body.style.behavior='url(#default#homepage)'; 
           document.body.setHomePage(url); 
    }else{ 
        alert("您好,您的浏览器不支持自动设置页面为首页功能,请您手动在浏览器里设置该页面为首页!"); 
    } 

} 