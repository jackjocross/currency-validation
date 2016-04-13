angular.module('app', []);

(function() {
	'use strict';

	angular
		.module('app')
		.directive('restrictToCurrency', restrictToCurrency);

	restrictToCurrency.$inject = ['$filter'];

	function restrictToCurrency($filter) {

		var directive = {
			restrict: 'A',
			require: 'ngModel',
			link: restrictToCurrencyLink
		}

		return directive;

		function restrictToCurrencyLink(scope, element, attrs, ctrl) {
			
			var lastValue;

			ctrl.$parsers.push(function(value) {
				// Remove all spaces and commas
				value = value.replace(/\ |\,/g, '');

				// Add commas back in at correct places
				value = value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

				var currencyRegex = /^([0]?|[1-9]\d{0,2}|[1-9]?\d{1}\,?\d{3})(\.\d{0,2}?)?$/;

				// Check if the value passes our restrictions on currency
				if (!currencyRegex.test(value)) {
					value = lastValue
				} else {
					lastValue = value;
				}

				// Update the value in the view
				ctrl.$setViewValue(value)
          		ctrl.$render()

				return value;
			});

			element.bind('blur', function() {
				// Don't form currency if the field is empty
				if (typeof ctrl.$viewValue === 'undefined' || !ctrl.$viewValue.length) {
					return;
				}

				// Remove all commas 
				var valueNoCommas = ctrl.$viewValue.replace(/\,/g, '');

				// Convert the number to a properly formatted currency
				var valueAsCurrency = $filter('currency')(valueNoCommas, '');

				// Update the value in the view
				ctrl.$setViewValue(valueAsCurrency)
          		ctrl.$render()
			});
		}
	}

})();