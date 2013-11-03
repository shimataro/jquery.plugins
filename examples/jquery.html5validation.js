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
			// validation functions
			var validateFunctions = {
				required: function(value, attr)
				{
					return (value !== "");
				},
				pattern: function(value, attr)
				{
					var re = new RegExp("^(?:" + attr + ")$");
					return (value === "") || re.test(value);
				},
				min: function(value, attr)
				{
					return (value === "") || (value >= attr);
				},
				max: function(value, attr)
				{
					return (value === "") || (value <= attr);
				}
			};

			// delete attributes that browser supports natively
			var input = document.createElement("input");
			for(var attrName in validateFunctions)
			{
				if(attrName in input)
				{
					delete validateFunctions[attrName];
				}
			}

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
						for(var attrName in validateFunctions)
						{
							var result = true;
							$targets.filter("[" + attrName + "]").each(function()
							{
								var $target = $(this);
								var value   = $target.val();
								var attr    = $target.attr(attrName);
								if(validateFunctions[attrName](value, attr))
								{
									// passed
									return true;
								}

								// alert error message
								var message = $target.attr(attrName + "-error");
								if(message !== undefined)
								{
									window.alert(message);
								}

								// focus and select
								$target.trigger("focus").trigger("select");
								result = false;
								return false;
							});
							if(!result)
							{
								// cancel remaining event handlers
								event.stopImmediatePropagation();
								return false;
							}
						}
						return true;
					})
				;
			};
		})($)
	});
})(jQuery, window);
