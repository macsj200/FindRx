'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Prescription Schema
 */
var PrescriptionSchema = new Schema({
    sphere: {
        type: Number,
        required:true
    },
    cylinder: {
        type: Number,
        required:true
    },
    axis: {
        type: Number,
        required:true
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

mongoose.model('Prescription', PrescriptionSchema);