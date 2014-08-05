'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Medium = mongoose.model('Medium'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    multiparty = require('multiparty');

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
 * get a form with file(s) and save it
 */
var getFormSaveFiles = function(req, res, medium, saveCallback) {

    //is this the problem?
    //create new form object
    var form = new multiparty.Form();


    //or maybe this?
    form.parse(req, function(err, fields, files) {
        /* Temporary location of our uploaded file */
//        var temp_path = this.openedFiles[0].path;

        var file = files.file;

        var temp_path = file.path;

        /* The file name of the uploaded file */
        var file_name = medium._id;

        var suffix = file.name.slice(file.name.lastIndexOf('.'));

        /* Location where we want to copy the uploaded file */
        var new_location = 'public/media/';

        fs.copy(temp_path, new_location + file_name + suffix, function (err) {
            if (err) {
                saveCallback(err);
            } else {
                medium.src = '/media/' + file_name + suffix;
                saveCallback(null);
            }
        });
    });
};

/**
 * Create a Medium
 */
exports.create = function(req, res) {
    //problem:  When I do a file upload post with postman,
    //  I get an 'invalid JSON' 500 error from the backend
    //  but I can't figure out where JSON is even being parsed
    //  if you can figure out where this error is coming from
    //  I can take it from there

    //  grunt is running in the second terminal tab, the other
    //  tab is just a shell

    //This only happens in postman if I do a file upload, not
    //  any other kind of form


    //I have tried commenting the contents of this function out, it didn't help

    //I really don't think it's this block
    var medium = new Medium();
    medium.user = req.user;

    //probably the problem is in this function
    getFormSaveFiles(req, res, medium, function(err) {
        //this callback is for the image only
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
            //do an error response saying something went wrong with the image
        } else {
            medium.save(function(err) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(medium);
                }
            });
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