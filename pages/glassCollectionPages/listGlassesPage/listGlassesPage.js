/**
 * Created by wesley on 6/8/15.
 */

if (Meteor.isClient) {

    Navbar.add({
        url: '/glasses',
        menuName: 'Glasses',
        menuOrientation: 'left'
    });

    Session.setDefault("glasses.filter", false);


    Router.route('/glasses', function() {
       this.render('listGlassesPage');
    });

    Template.listGlassesPage.helpers({
       hasResults: function() {
           return Glasses.find().count();
       },
       isDisabled: function(filter) {
         if (Session.get('glasses.filter')  && filter === 'oldest-first') {
           return 'disabled';
         }
         if (!Session.get('glasses.filter') && filter === 'newest-first') {
           return 'disabled';
         }
        return '';
      },
      sortSettings: function() {
        return {
            createdAt: -1
        }
      }
    });

    Template.listGlassesPage.events({
        'click #oldest-first': function() {
            Glasses.findList.set({
               sort: {
                   createdAt: 1
               }
            });

            Session.set('glasses.filter', true);

        },
        'click #newest-first': function() {
            Glasses.findList.set({
                sort: {
                    createdAt: -1
                }
            });

            Session.set('glasses.filter', false);

        }
    });

}
