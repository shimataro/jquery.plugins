/*!
 * Supports HTML5 "required" attribute
 * requires:
 *  jQuery 1.3+
 */
(function($, window)
{
	var document = window.document;

	$.fn.extend({
		/**
		 * Supports HTML5 "required" attribute
		 * @function
		 */
		html5Required: (function($)
		{
			var supported = (document.createElement("input").required !== undefined);

			return function()
			{
				if(supported)
				{
					// do nothing if supported by browser
					return this;
				}

				return this
					.bind("submit", function(event)
					{
						$(this)
							.find(":input[required]")
							.each(function()
							{
								var $target = $(this);
								var value = $target.val();
								if(value !== "")
								{
									return true;
								}

								var message = $target.attr("data-required-error");
								if(message !== undefined)
								{
									window.alert(message);
								}

								$target.trigger("focus");
								event.preventDefault();
								event.stopPropagation();
								event.stopImmediatePropagation();
								return false;
							})
						;
						return true;
					})
				;
			};
		})($)
	});
})(jQuery, window);

