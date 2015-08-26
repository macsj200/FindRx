/**
 * Created by wesley on 6/8/15.
 */

if (Meteor.isClient) {

    /*
     After they click the confirm delete button,
     we remove the glass document, hide the modal,
     and re-direct them to the list of glasses
     */
    Template.confirmGlassDeleteModal.events({
        'click #confirmDelete': function() {
            Glasses.remove(this._id, function() {
                Modal.hide();
                Router.go('/glasses');
            });
        }
    });

}