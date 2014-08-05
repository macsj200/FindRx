'use strict';

// Prescriptions controller
angular.module('prescriptions').controller('PrescriptionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Prescriptions',
	function($scope, $stateParams, $location, Authentication, Prescriptions ) {
		$scope.authentication = Authentication;

		// Create new Prescription
		$scope.create = function() {
			// Create new Prescription object
			var prescription = new Prescriptions ({
				name: this.name
			});

			// Redirect after save
			prescription.$save(function(response) {
				$location.path('prescriptions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Prescription
		$scope.remove = function( prescription ) {
			if ( prescription ) { prescription.$remove();

				for (var i in $scope.prescriptions ) {
					if ($scope.prescriptions [i] === prescription ) {
						$scope.prescriptions.splice(i, 1);
					}
				}
			} else {
				$scope.prescription.$remove(function() {
					$location.path('prescriptions');
				});
			}
		};

		// Update existing Prescription
		$scope.update = function() {
			var prescription = $scope.prescription ;

			prescription.$update(function() {
				$location.path('prescriptions/' + prescription._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Prescriptions
		$scope.find = function() {
			$scope.prescriptions = Prescriptions.query();
		};

		// Find existing Prescription
		$scope.findOne = function() {
			$scope.prescription = Prescriptions.get({ 
				prescriptionId: $stateParams.prescriptionId
			});
		};
	}
]);