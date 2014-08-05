'use strict';

// Configuring the Articles module
angular.module('media').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Media', 'media', 'dropdown', '/media(/create)?');
		Menus.addSubMenuItem('topbar', 'media', 'List Media', 'media');
		Menus.addSubMenuItem('topbar', 'media', 'New Medium', 'media/create');
	}
]);