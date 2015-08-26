if (Meteor.isClient) {
  Template.findOneGlass.onCreated(function() {

     var glassId = Template.currentData().glassId;

     this.subscribe('glass', glassId);
  });

  Template.findOneGlass.helpers({
    currentGlass: function() {
      var glassId = Template.currentData().glassId;
      return Glasses.findOne({_id: glassId});
    }
  });

}
