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
    searchGlasses:function(query,idealGlasses){
      // inner product
      function innerProduct(a, b){
        return a.dot(b.trans()).data[0][0];
      }

      // norm function
      function norm(matrix) {
        m = matrix.data;
        var squared_sum = 0;
        for (i = 0; i < m[0].length; i++) {
          squared_sum += Math.pow(m[0][i], 2);
        }
        return Math.sqrt(squared_sum);
      }

      // calculates innerProduct(ideal, actual) / (norm(actual)*norm(ideal))
      function calcCosSim(idealMatrix, actualMatrix) {
        var innerProductValue = innerProduct(idealMatrix, actualMatrix);
        var idealMatrixNorm = norm(idealMatrix);
        var actualMatrixNorm = norm(actualMatrix);
        // avoids the edge case where denominator = 0;
        if (idealMatrixNorm == 0 && actualMatrixNorm == 0) {
          return 1;
        }
        else if (idealMatrixNorm == 0){
          return actualMatrixNorm;
        }
        // ignoring the glasses with all 0s parameters
        else if (actualMatrixNorm == 0) {
          return 0;
        }
        else {
          var cosSim = innerProductValue / (idealMatrixNorm * actualMatrixNorm);
          return Math.round(cosSim * 10000) / 10000;
        }
      }

      var linearAlgebra = Meteor.npmRequire('linear-algebra')(),     // initialise it
          Vector = linearAlgebra.Vector,
          Matrix = linearAlgebra.Matrix;

      var res = Glasses.find(query).fetch();


      const SPH_WEIGHT = 100;
      const CYL_WEIGHT = 10;
      const AXIS_WEIGHT = 1;

      function getSimScore(actualGlasses) {
      	var weights = new Matrix([SPH_WEIGHT, SPH_WEIGHT, CYL_WEIGHT, CYL_WEIGHT, AXIS_WEIGHT, AXIS_WEIGHT]);

      	var idealMatrix = new Matrix(weights.mul(new Matrix([idealGlasses["rightRx.sphere"], idealGlasses["leftRx.sphere"], idealGlasses["rightRx.cylinder"], idealGlasses["leftRx.cylinder"], idealGlasses["rightRx.axis"], idealGlasses["leftRx.axis"]])).data[0]);
      	// var actualMatrix = new Matrix(weights.mul(new Matrix([actualGlasses["rightRx.sphere"], actualGlasses["leftRx.sphere"], actualGlasses["rightRx.cylinder"], actualGlasses["leftRx.cylinder"], actualGlasses["rightRx.axis"], actualGlasses["leftRx.axis"]])).data[0]);
        var actualMatrix = new Matrix(weights.mul(new Matrix([actualGlasses.rightRx.sphere, actualGlasses.leftRx.sphere, actualGlasses.rightRx.cylinder, actualGlasses.leftRx.cylinder, actualGlasses.rightRx.axis, actualGlasses.leftRx.axis])).data[0]);

        actualGlasses.cosSim = calcCosSim(idealMatrix, actualMatrix);

      	return actualGlasses;
      }

      res = res.map(getSimScore);
      res.sort(function(a,b) { return b.cosSim - a.cosSim});

      console.log(res);

      return res;
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

          Meteor.call('searchGlasses', searchQuery, doc.$set, function(err,res){
            console.log(res);
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
      console.log(decimal);
      return String(Math.round(decimal * 100)) + '%';
    }
  });

}
