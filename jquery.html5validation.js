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
			var _validateFunctions = {
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
						for(var attrName in _validateFunctions)
						{
							if(input[attrName] !== undefined)
							{
								// do not check when browser supports attrName natively
								continue;
							}

							var result = true;
							$targets.filter("[" + attrName + "]").each(function()
							{
								var $target = $(this);
								var value   = $target.val();
								var attr    = $target.attr(attrName);
								if(_validateFunctions[attrName](value, attr))
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
							if(!result)
							{
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
