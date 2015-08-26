/**
 * Created by wesley on 6/8/15.
 */

if (Meteor.isClient) {

  // Router.map(function() {
  //   this.route('glass', {
  //       path: '/glasses/:_id',
  //       template: 'viewOneGlassPage', // <-- to be explicit
  //       data: function() {
  //           return {id: this.params._id};
  //       }
  //   });
  // });

  Router.route('/glasses/:_id', function () {
    this.render('viewOneGlassPage', {
        data: function () {
          return {id: this.params._id};
        }
      });
    });
    // Router.route('/glasses/:_id', function() {
    //
    //     //we must subscribe to the glass we are showing!!!
    //     this.subscribe('glass', this.params._id);
    //
    //     //now let's query that glass
    //     var glass = Glasses.findOne({_id: this.params._id});
    //
    //     //then set it as the 'this' object on the page, using the data object
    //     this.render('viewOneGlassPage', {data: {id: this.params._id}});
    // });

    //This is how you display a modal
    //In this case, we are displaying a modal to
    //confirm that the user wants to delete a specific glass
    Template.viewOneGlassPage.events({
        'click #deleteGlassButton': function() {

            //'this' is the current doc we are showing
            Modal.show('confirmGlassDeleteModal', this);
        }
    });

}
