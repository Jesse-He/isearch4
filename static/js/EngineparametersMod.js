var mateId = 0;
$(document).ready(function() {
	$.ajaxSettings.async = false;
	mateId = getRequest("mateid");
	leftColumShow(6);
	$("#topMenu").find('li').each(function() {
		$(this).removeClass();
	});
	loadPage();//初始加载页面
	$("#remark-info").click(changeInfo);
	backToTop();// back To Top
	$("#engineParmSave").click(function(){
		var metaName = $("input[id='iptinfo-item0']").val();
		var cate = $("input[id='iptinfo-item1']").val();
		var prefix = $("input[id='iptinfo-item2']").val();
		var postfix = $("input[id='iptinfo-item3']").val();
		var codeFormate = $("input[id='iptinfo-item4']").val();
		var divTag = $("input[id='iptinfo-item5']").val();
		var urlTag = $("input[id='iptinfo-item6']").val();
		var titleTag = $("input[id='iptinfo-item7']").val();
		var summTag = $("input[id='iptinfo-item8']").val();
		var dateTag = $("input[id='iptinfo-item9']").val();
		var sleep = $("input[id='iptinfo-item13']").val();
		var thread = $("input[id='iptinfo-item14']").val();
		var highSearch = $("input[id='iptinfo-item15']").val();
		var siteNameTag = $("input[id='iptinfo-item16']").val();
		$.post('../../handler/metasearch/modHotMetaSearch',
				{
					"metaId":mateId,
					"metaName":metaName,
					"metaCate":cate,
					"metaPrefix":prefix,
					"metapostfix":postfix,
					"metaCodeFormate":codeFormate,
					"metaDivTag":divTag,
					"metaUrlTag":urlTag,
					"metaTitleTag":titleTag,
					"metaSummTag":summTag,
					"metaDateTag":dateTag,
					"metaSleep":sleep,
					"metaThread":thread,
					"metaHighSearch":highSearch,
					"metaSiteNameTag":siteNameTag
				},
				function(data) {
					if (data.ret||data.data.data==1) {
						//r result = data.data.data;
						alert("修改成功！");
						window.location="EngineparametersMod.html?mateid="+mateId; 
					} else {
						infoNotice("error", "", data.errmsg);
					}
				}, "json");
	});
});

//初始加载页面
function loadPage() {
	$.ajaxSettings.async = false;
	$.post('../../handler/metasearch/queOneHotMetaSearch',
			{
		"metaId":mateId
			},
			function(data) {
				if (data.ret) {
					var result = data.data.data;
					showUserInfo1(result) ;
				} else {
					infoNotice("error", "", data.errmsg);
				}
			}, "json");
}
/**
 * 展示用户信息
 * 
 * @author anny
 * @param data
 */
function showUserInfo1(backInfo) {
	var data =  backInfo;
	if (null != data) {
		var arr = new Array(data.metaName, data.cate,data.prefix,data.postfix,data.codeFormate,data.divTag,data.urlTag,data.titleTag,data.summTag,data.dateTag,data.urlAd,data.titleAd,data.summAd,data.sleep,data.thread,data.highSearch,data.siteNameTag);
		for ( var i = 0; i < 17; i++) {
			var id = "#info-item" + i;
			var ider = "iptinfo-item"+i;
			if(arr[i]==undefined)
				arr[i]="";
			$(id).html("<input id='"+ider+"' type='text' readonly='readonly' value='"+arr[i]+"'>");
		}
	}
}

/**
 * 修改用户信息，界面上发生的变化
 */
function changeInfo()
{
	$("#remark-info").html("<i class='icon-pencil icon-white'></i>正在修改");
	$("input").each(function(index){
		$(this).removeAttr("readonly");
	});
	$("#engineParmSave").removeAttr("style").css("text-align","center");
	//$("span").filter("[class='info']").html("可编辑").css("color","green").css("font-size","15px");
}


