/**
 * Created by wesley on 6/8/15.
 */

if (Meteor.isClient) {

    Navbar.add({
        url: '/glasses',
        menuName: 'Glasses',
        menuOrientation: 'left'
    });


    Router.route('/glasses', function() {
       this.render('listGlassesPage');
    });

    // Template.listGlassesPage.helpers({
    //    hasResults: function() {
    //       //  return Glasses.find().count();
    //    },
    //    sortSettings: function() {
    //     return {
    //         // createdAt: -1
    //     }
    //   }
    // });

}
