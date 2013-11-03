/*!
 * Supports HTML5 "pattern" attribute
 * requires:
 *  jQuery 1.3+
 */
(function($, window)
{
	var document = window.document;

	$.fn.extend({
		/**
		 * Supports HTML5 "pattern" attribute
		 * @function
		 */
		html5Pattern: (function($)
		{
			var supported = (document.createElement("input").pattern !== undefined);

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
						var $form = $(this);
						if($form.attr("novalidate") !== undefined)
						{
							return true;
						}

						$form
							.find(":input:visible:enabled[pattern]")
							.each(function()
							{
								var $target = $(this);
								if($target.attr("readonly"))
								{
									// passed
									return true;
								}

								var pattern = $target.attr("pattern");
								var value   = $target.val();
								var re = new RegExp("^(?:" + pattern + ")$");
								if(re.test(value))
								{
									// passed
									return true;
								}

								var message = $target.attr("data-pattern-error");
								if(message !== undefined)
								{
									window.alert(message);
								}

								$target.trigger("focus").trigger("select");
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

