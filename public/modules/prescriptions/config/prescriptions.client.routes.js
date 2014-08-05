'use strict';

//Setting up route
angular.module('prescriptions').config(['$stateProvider',
	function($stateProvider) {
		// Prescriptions state routing
		$stateProvider.
		state('listPrescriptions', {
			url: '/prescriptions',
			templateUrl: 'modules/prescriptions/views/list-prescriptions.client.view.html'
		}).
		state('createPrescription', {
			url: '/prescriptions/create',
			templateUrl: 'modules/prescriptions/views/create-prescription.client.view.html'
		}).
		state('viewPrescription', {
			url: '/prescriptions/:prescriptionId',
			templateUrl: 'modules/prescriptions/views/view-prescription.client.view.html'
		}).
		state('editPrescription', {
			url: '/prescriptions/:prescriptionId/edit',
			templateUrl: 'modules/prescriptions/views/edit-prescription.client.view.html'
		});
	}
]);