'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Prescription = mongoose.model('Prescription'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Prescription already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Prescription
 */
exports.create = function(req, res) {
	var prescription = new Prescription(req.body);
	prescription.user = req.user;

	prescription.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(prescription);
		}
	});
};

/**
 * Show the current Prescription
 */
exports.read = function(req, res) {
	res.jsonp(req.prescription);
};

/**
 * Update a Prescription
 */
exports.update = function(req, res) {
	var prescription = req.prescription ;

	prescription = _.extend(prescription , req.body);

	prescription.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(prescription);
		}
	});
};

/**
 * Delete an Prescription
 */
exports.delete = function(req, res) {
	var prescription = req.prescription ;

	prescription.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(prescription);
		}
	});
};

/**
 * List of Prescriptions
 */
exports.list = function(req, res) { Prescription.find().sort('-created').populate('user', 'displayName').exec(function(err, prescriptions) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(prescriptions);
		}
	});
};

/**
 * Prescription middleware
 */
exports.prescriptionByID = function(req, res, next, id) { Prescription.findById(id).populate('user', 'displayName').exec(function(err, prescription) {
		if (err) return next(err);
		if (! prescription) return next(new Error('Failed to load Prescription ' + id));
		req.prescription = prescription ;
		next();
	});
};

/**
 * Prescription authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.prescription.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};