'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rx Schema
 */
var RxSchema = new Schema({
    leftEye: {
        type: Schema.ObjectId,
        ref: 'Prescription'
    },
    rightEye: {
        type: Schema.ObjectId,
        ref: 'Prescription'
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rx', RxSchema);