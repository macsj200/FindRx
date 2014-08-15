'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Rx = mongoose.model('Rx'),
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
                message = 'Rx already exists';
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
 * Create a Rx
 */
exports.create = function(req, res) {
    var rx = new Rx(req.body);
    rx.user = req.user;

    rx.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(rx);
        }
    });
};

/**
 * Show the current Rx
 */
exports.read = function(req, res) {
    res.jsonp(req.rx);
};

/**
 * Update a Rx
 */
exports.update = function(req, res) {
    var rx = req.rx ;

    rx = _.extend(rx , req.body);

    rx.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(rx);
        }
    });
};

/**
 * Delete an Rx
 */
exports.delete = function(req, res) {
    var rx = req.rx ;

    rx.remove(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(rx);
        }
    });
};

/**
 * List of Rxes
 */
exports.list = function(req, res) {
    Rx.find().sort('-created').populate('user', 'displayName').populate({
        path: 'leftEye rightEye',
        select: 'sphere cylinder axis'
    })
        .exec(function(err, rxes) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(rxes);
            }
        });
};

/**
 * Search an rx
 * currently just an alias to list
 */
exports.search = function(req, res){
    console.log(req.body.searchParams);
    exports.list(req, res);
};

/**
 * Rx middleware
 */
exports.rxByID = function(req, res, next, id) { Rx.findById(id).populate('user', 'displayName').exec(function(err, rx) {
    if (err) return next(err);
    if (! rx) return next(new Error('Failed to load Rx ' + id));
    req.rx = rx ;
    next();
});
};

/**
 * Rx authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.rx.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};

//insert sample data
//clear db first
//Rx.remove().exec(function(err, data){});
//var sampleDB = require('./sampleDB');
//var Prescription = mongoose.model('Prescription');
//for(var i = 0; i < 5; i++){
//    var currentGlasses = sampleDB[i];
//
//    var leftEye = new Prescription(currentGlasses.leftEye);
//
//    var rightEye = new Prescription(currentGlasses.rightEye);
//
//    leftEye.save(function(err, data){
//        var leftEyeId = data._id;
//        rightEye.save(function(err, data){
//            var rightEyeId = data._id;
//
//            currentGlasses.leftEye = leftEyeId;
//            currentGlasses.rightEye = rightEyeId;
//
//            var rx = new Rx(currentGlasses);
//
//            rx.save(function(err, data){
//
//            });
//        });
//    });
//}