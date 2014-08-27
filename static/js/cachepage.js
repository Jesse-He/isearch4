//-----缓存分页全局变量-----
$.ajaxSettings.async = false;
var cacheRecords = new Array();// 缓存的记录
var cachePage = 3;// 缓存的页数
var recordPerPage = 10;// 每页的记录数
var currentPage = 1;// 当前页码
var totalPage = 1;// 总页码数
var recordCount = 0;// 记录总数
// -----缓存分页全局变量-----
function initialBind() {
	$.ajaxSettings.async = false;
	// 绑定分页点击功能的响应操作
	bindClickPage();
	// 绑定分页跳转功能的响应操作
	bindGotoPage();
	// 绑定切换每页显示数量的响应操作
	bindChangeRC();
	// 绑定分页中滑动按钮
	bindPageScan();
	// 绑定页码跳转的回车事件
	$("#gotopage").keydown(function(e) {
		if (e.keyCode == 13) {
			$("#goto").trigger("click");
		}
	});
	// 读取缓存页数、每页显示记录数
	cachePage = 3;
	recordPerPage = fristPage;
	$('#recordPage').val(fristPage);
}
// 绑定切换每页显示记录操作10\20\30
function bindChangeRC() {
	$('#recordPage').change(function() {
		recordPerPage = $(this).val();
		// 点击搜索，一切重新查找
		initSearch();
	});
}
// 当第一次进入时，或者每页记录数，或者点击查询的时候，全部重新加载
function initSearch() {
	var $records = $('#dataArea').children('tbody');
	$records
			.empty()
			.append(
					"<tr><td colspan=\"5\" class=\"tdcenter\"><img src=\"../img/octocat-spinner.gif\" />正在加载数据...</td></tr>");
	// 当前页设置为1
	currentPage = 1;
	// 添加以1开始的缓存页数的页码
	var askPageArray = new Array();
	var i;
	for (i = 1; i <= cachePage; i = i + 1) {
		askPageArray.push(i);
	}
	params.pageArray = askPageArray.toString();
	if (recordPerPage != $('#recordPage').val())
		recordPerPage = $('#recordPage').val();
	else
		params.recordPerPage = recordPerPage;
	// 向服务器发送请求
	$.post(viewaction, params, function(data) {
		// 获取总页数和总记录数
		totalPage = data.data.totalPage;
		recordCount = data.data.totalCount;
		// 清空当前缓存记录，加入返回的数据
		if (cacheRecords != null)
			cacheRecords.splice(0);
		var hasdata = false;// 判断当前是否有返回数据
		if (data.data.pageData != null) {
			$.each(data.data.pageData, function(pageIndex, pageEntry) {
				cacheRecords.push(pageEntry);
				if (pageEntry.page == currentPage) {
					refreshContent(pageEntry);
					hasdata = true;
				}
			});
		}
		// 如果返回的是空数据，直接刷新空数据
		if (!hasdata) {
			refreshContent({
				"page" : 1,
				"data" : new Array()
			});
		}
		// 刷新分页区域
		refreshPage();
	}, "json");
}
// 绑定点击分页的事件响应????????
function bindClickPage() {
	// 点击某一个分页的响应事件
	$('.page').live("click", function() {
		$current = $(this);
		$('.page').removeClass('active');
		$current.addClass('active');
		var clickPage = $current.children('a').text();
		currentPage = parseInt(clickPage);
		// 请求指定页
		pageView();
		return false;
	});
	$('#pagebackward').click(function() {
		$current = $(this);
		if (currentPage > 1) {
			currentPage = currentPage - 1;
		}
		if(currentPage<=1){
			alert("当前已是第一页！");
			return false;
		}
		// 请求指定页
		pageView();
		return false;
	});
	$('#pageforward').click(function() {
		$current = $(this);
		if (currentPage < totalPage) {
			currentPage = currentPage + 1;
		}
		if(currentPage >= totalPage){
			alert("当前已是最后一页！");
			return false;
		}
		// 请求指定页
		pageView();
		return false;
	});
}
// 从请求页码数组pageArray中删除缓存记录record，如果存在返回true，否则返回false
function removePage(pageArray, record) {
	var contain = false;
	var index = 0;
	$.each(pageArray, function(entryIndex, entry) {
		if (entry == record.page) {
			contain = true;
			index = entryIndex;
			return false;
		}
	});
	if (contain)
		pageArray.splice(index, 1);
	return contain;
}
// 绑定分页跳转功能的响应操作
function bindGotoPage() {
	$('#goto').click(function() {
		var $helpLine = $(this).next();
		$helpLine.empty();
		gotoPage = $('#gotopage').val();
		gotoPage = parseInt(gotoPage);
		if (gotoPage <= totalPage && gotoPage >= 1) {
			currentPage = gotoPage;
			// 请求指定页
			pageView();
			// 刷新分页区域
			refreshPage();
		} else {
			// $helpLine.append("<font color='red'>页码不在范围内</font>");
			alert("页码不在范围内，请重新输入！!");
			$('#gotopage').focus();
		}
		return false;
	});
}
// 点击分页或者跳转到指定页，请求指定页及对应缓存页进行显示
function pageView() {
	showHide();
	// 更新当前页码
	$('#currentPage').text(currentPage);
	// 判断点击页是否在缓存中
	var isCache = false;
	// 计算点击页的缓存范围
	var pageArray = new Array();
	var i;
	for (i = currentPage; i <= currentPage + cachePage && i <= totalPage; i = i + 1) {
		pageArray.push(i);
	}
	for (i = currentPage - 1; i >= currentPage - cachePage && i >= 1; i = i - 1) {
		pageArray.push(i);
	}
	// 保存需从缓存中清除的记录下标
	var removeCacheIndex = new Array();
	// 遍历缓存记录，如果请求页已缓存，不需要请求
	// 从请求数组中去除，如果不在缓存范围内，则从缓存中清除
	$.each(cacheRecords, function(entryIndex, entry) {
		// 如果当前页存在
		if (entry.page == currentPage) {
			isCache = true;
			refreshContent(entry);
			// alert("当前页在缓存中");
		}
		// 如果请求页已经在缓存中,删除该请求页.如果不存在，则记录该缓存记录，后面清除
		if (!removePage(pageArray, entry)) {
			removeCacheIndex.push(entryIndex);
		}
	});
	// 清除缓存中不在于请求范围的记录
	for (i = 0; i < removeCacheIndex.length; i = i + 1) {
		cacheRecords.splice(removeCacheIndex[i], 1);
	}
	if (pageArray == null || pageArray.length == 0) {
		// alert("请求页都在缓存中，不需要重新请求");
		return true;
	}
	// alert("请求页码:"+pageArray);
	params.pageArray = pageArray.toString();
	params.recordPerPage = recordPerPage;
	// 确定请求页数范围，发送请求
	// 向服务器发送请求
	$.post(viewaction, params, function(data) {
		// 获取总页数和总记录数
		totalPage = data.data.totalPage;
		recordCount = data.data.totalCount;
		// 如果当前页在缓存中，则直接将返回数据加入缓存记录中
		if (isCache) {
			cacheRecords.concat(data.data.pageData);
		}
		// 否则，遍历返回数据找到当前页数据
		else {
			// alert("当前页重新请求中");
			// 向缓存记录加入返回的数据
			$.each(data.data.pageData, function(pageIndex, pageEntry) {
				cacheRecords.push(pageEntry);
				if (pageEntry.page == currentPage)
					refreshContent(pageEntry);
			});
		}
	}, "json");

}

// 绑定页面中滑动按钮
function bindPageScan() {
	$('#backward').live("click", function() {
		var $pages = $('#pages');
		var leftPage = $pages.children(':first').text();
		leftPage = parseInt(leftPage);
		var nextLeftPage = leftPage - (2 * cachePage + 1);
		if (nextLeftPage <= 1) {
			$(this).hide();
			nextLeftPage = 1;
		}
		// 清空页码区域，重新加载
		$pages.empty();
		var i = nextLeftPage;
		for (; i <= nextLeftPage + 2 * cachePage && i <= totalPage; i = i + 1) {
			$pages.append("<li class='page'><a>" + i + "</a></li>");
		}
		$('#forward').show();
		return false;
	});
	$('#forward').die().live("click", function() {
		var $pages = $('#pages');
		var rightPage = $pages.children(':last').text();
		rightPage = parseInt(rightPage);
		var nextLeftPage = rightPage + 1;
		var nextRightPage = nextLeftPage + 2 * cachePage;
		if (nextRightPage >= totalPage) {
			$(this).hide();
			nextRightPage = totalPage;
		}
		// 清空页码区域，重新加载
		$pages.empty();
		var i = nextLeftPage;
		for (; i <= nextRightPage; i = i + 1) {
			$pages.append("<li class='page'><a>" + i + "</a></li>");
		}
		$('#backward').show();
		return false;
	});
}
// 根据当前页码和最大页码刷新分页区域
function refreshPage() {
	// /上一页、下一页
	showHide();
	// 确定页码范围
	var leftPage = currentPage - cachePage;
	var rightPage = leftPage + 2 * cachePage;
	if (leftPage <= 1) {
		leftPage = 1;
		rightPage = leftPage + 2 * cachePage;
		$('#backward').hide();
	}
	if (rightPage > totalPage) {
		rightPage = totalPage;
		$('#forward').hide();
	}
	var i;
	var $pages = $('#pages');
	$pages.empty();
	for (i = leftPage; i <= rightPage; i = i + 1) {
		var classes = "page";
		if (i == currentPage)
			classes += " active";
		$pages.append("<li class='" + classes + "'><a>" + i + "</a></li>");
	}
	$('#currentPage').text(currentPage);
	$('#totalPage').text(totalPage);
	$('#recordCount').text(recordCount);
}

// 上一页和下一页的隐藏与显示
function showHide() {
	// /上一页、下一页
	if (currentPage == 1 && currentPage == totalPage) {
		$('#pagebackward').addClass('disabled');
		$('#pageforward').addClass('disabled');
	} else if (currentPage == totalPage) {
		$('#pagebackward').removeClass('disabled');
		$('#pageforward').addClass('disabled');
	} else if (currentPage == 1) {
		$('#pageforward').removeClass('disabled');
		$('#pagebackward').addClass('disabled');
	} else {
		$('#pagebackward').removeClass('disabled');
		$('#pageforward').removeClass('disabled');
	}
}