/**
 * Created by wesley on 6/8/15.
 */

if (Meteor.isClient) {


    Router.route('/glasses/:_id/edit', function() {

        //we must subscribe to the glass we are showing!!!
        this.subscribe('glass', this.params._id);

        //now let's query that glass
        var glass = Glasses.findOne({_id: this.params._id});

        //then set it as the 'this' object on the page
        this.render('editGlassPage', {data: glass});
    });

    //after they insert a new glass, redirect back to
    //list of glasses

    //'insertGlass' is the id of the quickform we
    //and 'updateGlass' are the id's of the quickforms
    //we want to listen to, not the name of the page level templates
    AutoForm.addHooks('updateGlass', {

        //the onSuccess method gets called after
        //a successful submit on either of the forms
        onSuccess: function(formType, result) {

            //this.docId is the _id of the document
            //the form just changed, so we will
            //load the url of that item and show the user
            //the result
            Router.go('/glasses/' + this.docId);
        }
    });

}