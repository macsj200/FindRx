'use strict';

// Configuring the Articles module
angular.module('rxes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rxes', 'rxes', 'dropdown', '/rxes(/create)?');
		Menus.addSubMenuItem('topbar', 'rxes', 'List Rxes', 'rxes');
		Menus.addSubMenuItem('topbar', 'rxes', 'New Rx', 'rxes/create');
	}
]);