'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Medium = mongoose.model('Medium'),
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
				message = 'Medium already exists';
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
 * Create a Medium
 */
exports.create = function(req, res) {
	var medium = new Medium(req.body);
	medium.user = req.user;

	medium.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(medium);
		}
	});
};

/**
 * Show the current Medium
 */
exports.read = function(req, res) {
	res.jsonp(req.medium);
};

/**
 * Update a Medium
 */
exports.update = function(req, res) {
	var medium = req.medium ;

	medium = _.extend(medium , req.body);

	medium.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(medium);
		}
	});
};

/**
 * Delete an Medium
 */
exports.delete = function(req, res) {
	var medium = req.medium ;

	medium.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(medium);
		}
	});
};

/**
 * List of Media
 */
exports.list = function(req, res) { Medium.find().sort('-created').populate('user', 'displayName').exec(function(err, media) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(media);
		}
	});
};

/**
 * Medium middleware
 */
exports.mediumByID = function(req, res, next, id) { Medium.findById(id).populate('user', 'displayName').exec(function(err, medium) {
		if (err) return next(err);
		if (! medium) return next(new Error('Failed to load Medium ' + id));
		req.medium = medium ;
		next();
	});
};

/**
 * Medium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.medium.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};