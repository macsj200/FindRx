'use strict';

//Prescriptions service used to communicate Prescriptions REST endpoints
angular.module('rxes').factory('Prescriptions', ['$resource',
	function($resource) {
		return $resource('prescriptions/:prescriptionId', { prescriptionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);