'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var prescriptions = require('../../app/controllers/prescriptions');

	// Prescriptions Routes
	app.route('/prescriptions')
		.get(prescriptions.list)
		.post(users.requiresLogin, prescriptions.create);

	app.route('/prescriptions/:prescriptionId')
		.get(prescriptions.read)
		.put(users.requiresLogin, prescriptions.hasAuthorization, prescriptions.update)
		.delete(users.requiresLogin, prescriptions.hasAuthorization, prescriptions.delete);

	// Finish by binding the Prescription middleware
	app.param('prescriptionId', prescriptions.prescriptionByID);
};