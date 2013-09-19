/*!
 * get associated labels
 * requires:
 *  jQuery 1.3+
 */
(function($, window)
{
	$.fn.extend({
		labels: (function($)
		{
			return function()
			{
				var $element = this;

				// wrapping label
				var $labels = $element.closest("label");

				// labels that indicates "this" by "for" attribute
				$element.each(function()
				{
					var id = $(this).attr("id");
					if(id !== "")
					{
						var selector = "label[for='" + id + "']";
						$labels = $labels.add(selector);
					}
				});
				return $labels;
			};
		})($)
	});
})(jQuery, window);
