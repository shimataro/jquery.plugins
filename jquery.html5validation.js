/*! jquery.html5validation.js */
(function($, window)
{
	var document = window.document;

	$.extend({
		/**
		 * Check whether browser supports specified attribute or not.
		 * requires:
		 *  Browser: Internet Explorer(6+), Firefox, Google Chrome, Opera
		 *  jQuery: 1.0+
		 * @function
		 * @param {String} elementName element name to be checked
		 * @param {String} attrName    attribute name to be checked
		 * @return {Boolean} Yes/No
		 */
		isSupportedAttribute: (function($)
		{
			var elements = {};
			return function(elementName, attrName)
			{
				if(!(elementName in elements))
				{
					elements[elementName] = document.createElement(elementName);
				}
				return (attrName in elements[elementName]);
			};
		})($),
		/**
		 * Check whether browser supports specified input type or not.
		 * requires:
		 *  Browser: Internet Explorer(6+), Firefox, Google Chrome, Opera
		 *  jQuery: 1.0+
		 * @function
		 * @param {String} typeName type name to be checked
		 * @return {Boolean} Yes/No
		 */
		isSupportedInputType: (function($)
		{
			var input = document.createElement("input");
			return function(typeName)
			{
				input.setAttribute("type", typeName);
				return (input.type === typeName);
			};
		})($)
	});

	$.extend({
		/**
		 * Emulates autofocus attribute
		 * requires:
		 *  Browser: Internet Explorer(6+), Firefox, Google Chrome, Opera
		 *  jQuery: 1.0+
		 * @function
		 */
		autofocus: (function($)
		{
			return function()
			{
				if(!$.isSupportedAttribute("input", "autofocus"))
				{
					$(":input:visible:enabled:not([readonly])[autofocus]:first").trigger("focus");
				}
				return this;
			};
		})($)
	});

	$.fn.extend({
		/**
		 * Emulates HTML5 validation (required, pattern, min, max)
		 * requires:
		 *  Browser: Internet Explorer(6+), Firefox(latest), Google Chrome(latest), Opera(12, 15)
		 *  jQuery: 1.3+
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
			for(var attrName in validateFunctions)
			{
				if($.isSupportedAttribute("input", attrName))
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

	$(function($)
	{
		$.autofocus();
		$("form").html5validation();
	});
})(jQuery, window);
