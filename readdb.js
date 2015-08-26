if(Meteor.isServer){
  Meteor.startup(function(){
    if(Glasses.find().fetch().length === 0){
      var dbobj = JSON.parse(Assets.getText('db.json'));

      var arr = dbobj["Current Database - Table 1"];

      console.log('Glasses db empty, reading in private/db.json');

      var entryIsValid = function(entry){
        return entry["R SPH"] && entry["R CYL"] && entry["R AXIS"]
          && entry["L SPH"] && entry["L CYL"] && entry["L AXIS"];
      };

      for(var i = 0; i < arr.length; i++){
        var item = arr[i];

        if(entryIsValid(item)){
          var newItem = {
            number:item["No."],
            frame:item.FRAME,
            lens:item.LENS,
            leftRx:{
              sphere:item["L SPH"],
              cylinder:item["L CYL"],
              axis:item["L AXIS"]
            },
            rightRx:{
              sphere:item["R SPH"],
              cylinder:item["R CYL"],
              axis:item["R AXIS"]
            },
          }

          // console.log(newItem);

          Glasses.insert(newItem);
        } else {
          // console.log('item empty')
        }
      }
    }
  });
}
