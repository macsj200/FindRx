'use strict';

//Rxes service used to communicate Rxes REST endpoints
angular.module('rxes').factory('Rxes', ['$resource',
	function($resource) {
		return $resource('rxes/:rxId', { rxId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);