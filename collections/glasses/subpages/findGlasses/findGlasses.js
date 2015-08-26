Glasses.paginations = [];

Glasses.paginations.push(new Meteor.Pagination(Glasses, {
       infinite: true,
       itemTemplate: 'glassInFindList',
       templateName: "glasses",
       sort: {
           createdAt: -1
       },
       availableSettings: {
           sort: true,
           filter: true
       },
       fastRender: true
}));

if (Meteor.isClient) {

    Template.findGlasses.onCreated(function() {

      Tracker.autorun(function(){

        Glasses.paginations[0].set({
          sort: Template.currentData().sort || {},
          filter: Template.currentData().filter || {}
        });
    });
  });


}
