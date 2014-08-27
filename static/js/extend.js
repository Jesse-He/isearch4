(function($) {
	$.fn
			.extend({
				// pass the options variable to the function
				confirmModal : function(options) {
					var html = '<div class="modal" id="confirmContainer"><div class="modal-header">'
							+ '<h3>#Heading#</h3></div><div class="modal-body">'
							+ '#Body#</div><div class="modal-footer">'
							+ '<a href="#" class="btn btn-primary" id="confirmYesBtn">确认</a>'
							+ '<a href="#" class="btn" id="confirmNoBtn">取消</a></div></div>';

					var defaults = {
						heading : 'Please confirm',
						body : 'Body contents',
						callbackYes : null,
						callbackNo : null
					};

					var options = $.extend(defaults, options);
					html = html.replace('#Heading#', options.heading).replace(
							'#Body#', options.body);
					$(this).html(html);
					$(this).modal('show');
					var context = $(this);
					$('#confirmYesBtn', this).click(function() {
						if (options.callbackYes != null)
							options.callbackYes();
						$(context).modal('hide');
					});
					$('#confirmNoBtn', this).click(function() {
						if (options.callbackNo != null)
							options.callbackNo();
						$(context).modal('hide');
					});
				}
			});

})(jQuery);
(function($) {
	$.fn
			.extend({
				// pass the options variable to the function
				infoAlert : function(options) {
					var html = '<div class="modal" id="alertContainer"><div class="modal-header">'
							+ '<h3>#Heading#</h3></div><div class="modal-body">'
							+ '#Body#</div><div class="modal-footer">'
							+ '<a href="#" class="btn btn-primary" id="closeBtn">关闭</a>';

					var defaults = {
						heading : 'Please notice',
						body : 'Body contents',
						callbackClose : null,
					};

					var options = $.extend(defaults, options);
					html = html.replace('#Heading#', options.heading).replace(
							'#Body#', options.body);
					$(this).html(html);
					$(this).modal('show');
					var context = $(this);
					$('#closeBtn', this).click(function() {
						if (options.callbackClose != null)
							options.callbackClose();
						$(context).modal('hide');
					});
				}
			});

})(jQuery);
jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires
				&& (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime()
						+ (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires
															// attribute,
															// max-age is not
															// supported by IE
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [ name, '=', encodeURIComponent(value), expires,
				path, domain, secure ].join('');
	} else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for ( var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie
							.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};
function getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(
			cookie_start + name.length + 1,
			(cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	expires.setTime(expires.getTime() + seconds);
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
			+ (expires ? '; expires=' + expires.toGMTString() : '')
			+ (path ? '; path=' + path : '/')
			+ (domain ? '; domain=' + domain : '') + (secure ? '; secure' : '');
}