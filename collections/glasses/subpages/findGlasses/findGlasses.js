// Glasses.paginations = [];
//
// Glasses.paginations.push(new Meteor.Pagination(Glasses, {
//   infinite: true,
//   itemTemplate: 'glassInFindList',
//   templateName: "glasses",
//   sort: {
//     createdAt: -1
//   },
//   availableSettings: {
//     sort: true,
//     filter: true
//   },
//   fastRender: true,
// }));

var constructRangeQuery = function(lowerBound, upperBound){
  return {
    $gte:lowerBound,
    $lte:upperBound
  };
};

var constructFloorRangeQuery = function(val){
  if(val <= 0){
    return constructRangeQuery(val, 0);
  } else {
    return constructRangeQuery(0, val);
  }
};

// var constructAxisQuery = function(axis){
//   //TODO check this function
//   var range = 30;
//
//   if(axis + range > 180){
//     return {$or:[constructRangeQuery(0,(axis + range) % 180),
//       constructRangeQuery(axis - range,180)]};
//   }
//
//   if(axis - range < 0){
//     return {$or:[constructRangeQuery(0,axis + range),
//       constructRangeQuery(180 + (axis - range),180)]};
//   }
//   return constructRangeQuery((axis - range) % 180, (axis + range) % 180);
// };

var constructGlassesQuery = function(glasses){
  // var query = {$or:['leftRx.axis':constructAxisQuery()]};
  var range = 30;

  var query = {};

  if(glasses["leftRx.axis"] + range > 180){
    query.$or = [{'leftRx.axis':constructRangeQuery(0,(glasses["leftRx.axis"] + range) % 180)},
      {'leftRx.axis':constructRangeQuery(glasses["leftRx.axis"] - range,180)}];
  }
  else if(glasses["leftRx.axis"] - range < 0){
    query.$or = [{'leftRx.axis':constructRangeQuery(0,glasses["leftRx.axis"] + range)},
      {'leftRx.axis':constructRangeQuery(180 + (glasses["leftRx.axis"] - range), 180)}];
  } else{
    query['leftRx.axis'] = constructRangeQuery(glasses["leftRx.axis"] - range, glasses["leftRx.axis"]+ range);
  }

  query['leftRx.sphere'] = constructFloorRangeQuery(glasses['leftRx.sphere']);
  query['leftRx.cylinder'] = constructFloorRangeQuery(glasses['leftRx.cylinder']);

  query['rightRx.sphere'] = constructFloorRangeQuery(glasses['rightRx.sphere']);
  query['rightRx.cylinder'] = constructFloorRangeQuery(glasses['rightRx.cylinder']);

  if(glasses["rightRx.axis"] + range > 180){
    query.$or = [{'rightRx.axis':constructRangeQuery(0,(glasses["rightRx.axis"] + range) % 180)},
      {'rightRx.axis':constructRangeQuery(glasses["rightRx.axis"] - range,180)}];
  }
  else if(glasses["rightRx.axis"] - range < 0){
    query.$or = [{'rightRx.axis':constructRangeQuery(0,glasses["rightRx.axis"] + range)},
      {'rightRx.axis':constructRangeQuery(180 + (glasses["rightRx.axis"] - range), 180)}];
  } else{
    query['rightRx.axis'] = constructRangeQuery(glasses["rightRx.axis"] - range, glasses["rightRx.axis"]+ range);
  }

  return query;
}

if(Meteor.isServer){
  glassesQuery = {};
  Meteor.methods({
    searchGlasses:function(query){
      // return query;
      // query = {};
      // console.log(query);
      return Glasses.find(query,{limit:10}).fetch();
    }
  });
}

if (Meteor.isClient) {
  Session.set('glasses',[]);
  AutoForm.hooks({
    findGlass:{
      before:{
        update:function(doc){
          // We have to call the server bc minimongo derps out here
          // TODO fix when meteor gets updated
          var searchQuery = constructGlassesQuery(doc.$set);


          // console.log(query);

          Meteor.call('searchGlasses', searchQuery, function(err,res){
            console.log(res);
            Session.set('glasses',res);
          });

          this.result(false);
        }
      }
    }
  });

  Template.findGlasses.helpers({
    glasses:function(){
      return Session.get('glasses')
    }
  });

}
