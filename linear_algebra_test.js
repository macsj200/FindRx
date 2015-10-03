var linearAlgebra = require('linear-algebra')(),     // initialise it
    Vector = linearAlgebra.Vector,
    Matrix = linearAlgebra.Matrix;

const SPH_WEIGHT = 100;
const CYL_WEIGHT = 10;
const AXIS_WEIGHT = 1;

var rsph1 = 1;
var lsph1 = 1;
var rcyl1 = 2;
var lcyl1 = 2;
var raxis1 = 3;
var laxis1 = 3;
var rsph2 = 1;
var lsph2 = 1;
var rcyl2 = 2;
var lcyl2 = 2;
var raxis2 = 3;
var laxis2 = 3;

var weights = new Matrix([SPH_WEIGHT, SPH_WEIGHT, CYL_WEIGHT, CYL_WEIGHT, AXIS_WEIGHT, AXIS_WEIGHT]);

var prescription = new Matrix(weights.mul(new Matrix([rsph1, lsph1, rcyl1, lcyl1, raxis1, laxis1])).data[0]);
var glasses = new Matrix(weights.mul(new Matrix([rsph2, lsph2, rcyl2, lcyl2, raxis2, laxis2])).data[0]);

// dot product
var dotProduct = prescription.dot(glasses.trans()).data[0][0];

// norm function
function norm(matrix) {
	m = matrix.data;
	var squared_sum = 0;
	for (i = 0; i < m[0].length; i++) {
		squared_sum += Math.pow(m[0][i], 2);
	}
	return Math.sqrt(squared_sum);
}

var simScore = dotProduct / (norm(prescription) * norm(glasses));
simScore = Math.round(simScore * 10000) / 10000;
console.log(simScore);