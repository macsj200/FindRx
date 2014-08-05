'use strict';

angular.module('rxes').directive('prescription', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Prescription directive logic
				// ...

				element.text('this is the prescription directive');
			}
		};
	}
]);