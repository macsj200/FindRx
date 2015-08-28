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

  AutoForm.hooks({
    findGlass:{
      before:{
        update:function(doc){
          console.log(Glasses.find(doc.$set).fetch());
          this.result(false);
        }
      }
    }
  });

  Template.findGlasses.onCreated(function() {

    Tracker.autorun(function(){

      Glasses.paginations[0].set({
        sort: Template.currentData().sort || {},
        filter: Template.currentData().filter || {}
      });
    });
  });


}
