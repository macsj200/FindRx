if (Meteor.isClient) {

  Template.glassCreatorControls.onCreated(function() {

     var glassId = Template.currentData().glassId;

     this.subscribe('glass', glassId);
  });

  Template.glassCreatorControls.helpers({
    currentGlass: function() {
      var glassId = Template.currentData().glassId;
      return Glasses.findOne({_id: glassId});
    }
  });

  Template.glassCreatorControls.events({
      'click #deleteGlassButton': function() {
          //'this' is the current doc we are showing
          Modal.show('confirmGlassDeleteModal', this);
      }
  });

}
