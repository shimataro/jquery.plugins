/*!
 * Ajax form request
 * requires:
 *  jQuery 1.4+
 */
(function($, window)
{
	var document = window.document;

	$.fn.extend({
		/**
		 * @function
		 * @param {Function|Object} callback_or_options callback function(success) or options
		 * @return {jQuery} jQuery object
		 */
		ajaxForm: (function($)
		{
			return function(callback_or_options)
			{
				// set common options
				var options = {};
				if($.isFunction(callback_or_options))
				{
					options.success = callback_or_options;
				}
				else if($.isPlainObject(callback_or_options))
				{
					options = callback_or_options;
				}
				else
				{
					// throw exception
					throw new TypeError(callback_or_options + " must be a function or plain object.");
				}

				return this.each(function()
				{
					var $form  = $(this);
					var attrs = {
						url: "action",
						type: "method",
						contentType: "enctype"
					};

					// overwrite some options
					for(var key in attrs)
					{
						var value = $form.attr(attrs[key]);
						if(value !== undefined)
						{
							options[key] = value;
						}
					}
					options.data = $form.serialize();

					// do Ajax
					$.ajax(options);
				});
			};
		})($)
	});
})(jQuery, window);

