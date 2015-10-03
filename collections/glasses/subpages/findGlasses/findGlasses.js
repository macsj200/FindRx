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

var constructAxisQuery = function(axis){
  //TODO check this function
  var range = 30;

  var query = constructRangeQuery((axis - range) % 180, (axis + range) % 180);

  return query;
};

var constructGlassesQuery = function(glasses){
  var query = {};

  query['leftRx.sphere'] = constructFloorRangeQuery(glasses['leftRx.sphere']);
  query['leftRx.cylinder'] = constructFloorRangeQuery(glasses['leftRx.cylinder']);
  query['leftRx.axis'] = constructAxisQuery(glasses['leftRx.axis']);

  query['rightRx.sphere'] = constructFloorRangeQuery(glasses['rightRx.sphere']);
  query['rightRx.cylinder'] = constructFloorRangeQuery(glasses['rightRx.cylinder']);
  query['rightRx.axis'] = constructAxisQuery(glasses['rightRx.axis']);

  return query;
}

if(Meteor.isServer){
  glassesQuery = {};
  Meteor.methods({
    setGlassesAuthQuery:function(query){
      glassesQuery = query;
      Glasses.findList.reload();
    }
  });
}

if (Meteor.isClient) {
  AutoForm.hooks({
    findGlass:{
      before:{
        update:function(doc){
          // We have to call the server bc minimongo derps out here
          // TODO fix when meteor gets updated
          var searchQuery = constructGlassesQuery(doc.$set);


          // console.log(query);

          Meteor.call('setGlassesAuthQuery', searchQuery, function(err,res){
            // console.log(res);
          });

          this.result(false);
        }
      }
    }
  });

}
