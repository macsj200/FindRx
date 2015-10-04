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
    searchGlasses:function(query){
      query = {};
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
            Session.set('glasses',res);
          });

          this.result(false);
        }
      }
    }
  });

  Template.possibleGlasses.helpers({
    glasses:function(){
      return Session.get('glasses');
    },
    decimalToPercent:function(decimal) {
      return cosSim * 100;
    }
  });
}
