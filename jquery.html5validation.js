/*! jquery.html5validation.js */
(function($, window)
{
	var document = window.document;

	$.fn.extend({
		/**
		 * Emulates HTML5 validation (required, pattern, min, max)
		 * requires:
		 *  jQuery 1.3+
		 * caution:
		 *  "formnovalidate" is not supported
		 * @function
		 */
		html5validation: (function($)
		{
			var input = document.createElement("input");

			// validation functions
			var _validate = {
				required: function($target, value)
				{
					if(value !== "")
					{
						// passed
						return true;
					}
					return false;
				},
				pattern: function($target, value)
				{
					var pattern = $target.attr("pattern");
					var re = new RegExp("^(?:" + pattern + ")$");
					if(re.test(value))
					{
						// passed
						return true;
					}
					return false;
				},
				min: function($target, value)
				{
					var min = $target.attr("min");
					return value >= min;
				},
				max: function($target, value)
				{
					var max = $target.attr("max");
					return value <= max;
				}
			};

			return function()
			{
				return this
					.bind("submit", function(event)
					{
						var $form = $(this);
						if($form.attr("novalidate") !== undefined)
						{
							return true;
						}

						var $targets = $form.find(":input:visible:enabled:not([readonly])");
						var result = true;
						$.each(["required", "pattern", "min", "max"], function()
						{
							var attrName = this;
							if(input[attrName] !== undefined)
							{
								// do not check when browser supports attrName natively
								return true;
							}

							var selector = "[" + attrName + "]";
							$targets.filter(selector).each(function()
							{
								var $target = $(this);
								var value   = $target.val();
								if(_validate[attrName]($target, value))
								{
									// passed
									return true;
								}

								result = false;

								// alert error message
								var message = $target.attr("data-" + attrName + "-error");
								if(message !== undefined)
								{
									window.alert(message);
								}

								// focus and select
								$target.trigger("focus").trigger("select");

								// cancel remaining event handlers
								event.stopImmediatePropagation();
								return false;
							});
							return result;
						});
						return result;
					})
				;
			};
		})($)
	});
})(jQuery, window);

