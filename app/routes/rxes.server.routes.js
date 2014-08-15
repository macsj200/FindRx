'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var rxes = require('../../app/controllers/rxes');

	// Rxes Routes
	app.route('/rxes')
		.get(rxes.list)
		.post(users.requiresLogin, rxes.create);

    app.route('/rxes/search')
        .get(rxes.list)
        .post(users.requiresLogin, rxes.search);

	app.route('/rxes/:rxId')
		.get(rxes.read)
		.put(users.requiresLogin, rxes.hasAuthorization, rxes.update)
		.delete(users.requiresLogin, rxes.hasAuthorization, rxes.delete);

	// Finish by binding the Rx middleware
	app.param('rxId', rxes.rxByID);
};