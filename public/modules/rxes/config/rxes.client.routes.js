'use strict';

//Setting up route
angular.module('rxes').config(['$stateProvider',
	function($stateProvider) {
		// Rxes state routing
		$stateProvider.
		state('listRxes', {
			url: '/rxes',
			templateUrl: 'modules/rxes/views/list-rxes.client.view.html'
		}).
		state('createRx', {
			url: '/rxes/create',
			templateUrl: 'modules/rxes/views/create-rx.client.view.html'
		}).
		state('viewRx', {
			url: '/rxes/:rxId',
			templateUrl: 'modules/rxes/views/view-rx.client.view.html'
		}).
		state('editRx', {
			url: '/rxes/:rxId/edit',
			templateUrl: 'modules/rxes/views/edit-rx.client.view.html'
		});
	}
]);