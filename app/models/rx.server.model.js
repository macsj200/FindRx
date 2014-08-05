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
        required:true,
        type: Schema.ObjectId,
        ref: 'Prescription'
    },
    rightEye: {
        required:true,
        type: Schema.ObjectId,
        ref: 'Prescription'
    },
    frame:{
        type: String,
        trim:true
    },
    lens:{
        type: String,
        trim:true
    },
    photo: {
        type: Schema.ObjectId,
        ref: 'Medium'
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