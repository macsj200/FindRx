/**
 * Created by wesley on 6/4/15.
 */

/**
 * Define publications here
 */
Meteor.publish('glass', function(glassId) {
    return Glasses.find({_id: glassId});
});

/**
 *
 * Define your security permissions here
 *
 */

//they can only insert if they are a user
Glasses.permit('insert').ifLoggedIn().apply();

//can update if they are logged in and the document was created by them
Glasses.permit('update').ifLoggedIn().ifCreatedByUser().apply();

//can update if they are an admin
Glasses.permit('update').ifHasRole('admin').apply();

//can remove if they are logged in and the document was created by them
Glasses.permit('remove').ifLoggedIn().ifCreatedByUser().apply();

//can remove if they are an admin
Glasses.permit('remove').ifHasRole('admin').apply();