# isearch4
========

## 舆情分析系统展示，主要是利用元搜索引擎抓取数据，然后进行展示。利用情感分析，对文本进行情感计算，以图表的方式显示。
## 主要介绍前端结构

# 结构 文档结构 在static文件夹里面

  *  css  层叠样式表单
  *  html  超文本置标语言(==Hypertext Markup Language) 
  *  doc  介绍文档
  *  img  图片
  *  js  Javascript
  *  json 数据格式 json
  
# login.html

> login.js 登录函数 加密js 

```javascript
  验证信息
  登录
//重新加载验证码
function reloadcode() {
	document.getElementById('imgcode').src = 'checkcode.jsp?' + Math.random();
}
```
# isearch.html 首页

> isearch.js 主要介绍 轮转显示数据
> highcharts.js 首页曲线图显示数据量、柱状图显示搜索引擎数据、饼状图显示主题分类熟练 
> 词云显示关键词

```javascript
function msgmove() {
	var isIE = !!window.ActiveXObject;
	var isIE6 = isIE && !window.XMLHttpRequest;
	if ($("#oUl ul").attr("name") != "hovered") {
		// 判断ul的name属性是否为"hovered"，决定下面代码块是否运行，以实现鼠标经过暂停滚动。
		var height = $("#oUl li:last").height();
		if (isIE6) {
			// 判断IE6，jQuery的animate动画和opacity透明在一起使用在IE6中会出现中文重影现象，
			// 所以在ie6中实行透明的禁用。
			$("#oUl li:last").css({
				"height" : 0
			});
		} else {
			$("#oUl li:last").css({
				"opacity" : 0,
				"height" : 0
			});
			// 列表最后的li透明和高度设置为0
		}
		$("#oUl li:first").before($("#oUl li:last"));
		// 把列表最后的li提升到顶部，实现有限列表项无限循环滚动显示
		$("#oUl li:first").animate({
			"height" : height
		}, 300);
		// 列表顶部的li高度逐渐变高以把下面的li推下去
		if (!isIE6) {
			$("#oUl li:first").animate({
				"opacity" : "1"
			}, 300);
			// 在非IE6浏览器中设置透明淡入效果
		}
	}
	setTimeout("msgmove()", 4000);
	// 设置5秒滚动一次
}

```

# searchresult.html 

> 采用全文检索 solr 索引 便于快速检索 

# analyse.html

>  微博舆情情感指数走势图 按照时间段统计舆情的情感值，在曲线上进行显示
>  对于曲线的横坐标数据太多的情况进行了处理，间隔显示和数据选取两种方法。对坐标值太长进行了截断

```
/*
* data : 数据值 
* $content ： 显示的区域
*/

function sentiDisHtml(data, $content) {
	$.ajaxSettings.async = false;
	$content.empty();
	var lineLabels = new Array();
	var lineData = new Array();
	var stepNum = 1;
	var timeUnit = '';
	if (data.data != null && data.data.statData != null && data.data.statData.length > 0) {
		var resultData = data.data.statData;
		timeUnit = data.data.timeUnit;
		if (resultData.length > 20) {
			stepNum = 3;
		}
		if (resultData.length > 40) {
			stepNum = 4;
		}
		if (resultData.length > 55) {
			stepNum = 2;
		}
		var i = 0;
		var j = 0;
		for (i in resultData) {
			if (stepNum == 2) {
				if (i % 2 == 0) {
					lineLabels[j] = resultData[i].timeDesc;
					lineData[j] = resultData[i].sentiment;
					j++;
				}
			} else {
				lineLabels[i] = resultData[i].timeDesc;
				lineData[i] = resultData[i].sentiment;
			}
		}
	}
	$content.highcharts({
		chart : {
			type : 'spline',
			plotBackgroundColor : "#FFFFFF",
		},
		title : {
			text : '舆情情感指数走势图'
		},
		xAxis : {
			categories : lineLabels,
			tickmarkPlacement : 'on',
			title : {
				enabled : false
			},
			labels : {
				step : stepNum,
				formatter : function() {
					if (timeUnit == "时") {
						return this.value.substr(11, 2);
					} else if (timeUnit == "日") {
						return this.value.substr(5, 5);
					} else {
						return this.value;
					}
				}
			}
		},
		yAxis : {
			title : {
				text : '情感指数'
			},
			plotLines : [ {
				value : 0,
				color : 'green',
				dashStyle : 'shortdash',
				width : 2,
				label : {
					text : '中性'
				}
			} ],
			labels : {
				formatter : function() {
					if (this.value < -20) {
						return "极度负面(" + this.value + ")";
					} else if (this.value < -10) {
						return "比较负面(" + this.value + ")";
					} else if (this.value < -0.5) {
						return "比较负面(" + this.value + ")";
					} else if (this.value > 20) {
						return "极度正面(" + this.value + ")";
					} else if (this.value > 10) {
						return "稍微正面(" + this.value + ")";
					} else if (this.value > 0.5) {
						return "比较正面(" + this.value + ")";
					} else {
						return "中性(" + this.value + ")";
					}
				}
			},
		},
		tooltip : {
			shared : true,
			valueSuffix : ' ',
			valueDecimals : 5,// 数据值保留小数位数
		},
		plotOptions : {
			spline : {
				lineWidth : 1,
				lineColor : '#FE2E64',
				fillOpacity : 0.8,
				marker : {
					enabled : true,
					radius : 2,
					states : {
						hover : {
							enabled : true,
							radius : 4
						}
					}
				},
			}
		},
		series : [ {
			name : '情感指数 (' + timeUnit + ')',
			data : lineData
		} ]
	});
}

```

# 其他页面 

>  文本编辑页面，采用的clEditor/jquery.cleditor.css  和 clEditor/jquery.cleditor.js 还有 
