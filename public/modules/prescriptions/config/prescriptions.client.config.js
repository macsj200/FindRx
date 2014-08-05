'use strict';

// Configuring the Articles module
angular.module('prescriptions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Prescriptions', 'prescriptions', 'dropdown', '/prescriptions(/create)?');
		Menus.addSubMenuItem('topbar', 'prescriptions', 'List Prescriptions', 'prescriptions');
		Menus.addSubMenuItem('topbar', 'prescriptions', 'New Prescription', 'prescriptions/create');
	}
]);