'use strict';

// Rxes controller
angular.module('rxes').controller('RxesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rxes',
	function($scope, $stateParams, $location, Authentication, Rxes ) {
		$scope.authentication = Authentication;

		// Create new Rx
		$scope.create = function() {
			// Create new Rx object
			var rx = new Rxes ({
				name: this.name
			});

			// Redirect after save
			rx.$save(function(response) {
				$location.path('rxes/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Rx
		$scope.remove = function( rx ) {
			if ( rx ) { rx.$remove();

				for (var i in $scope.rxes ) {
					if ($scope.rxes [i] === rx ) {
						$scope.rxes.splice(i, 1);
					}
				}
			} else {
				$scope.rx.$remove(function() {
					$location.path('rxes');
				});
			}
		};

		// Update existing Rx
		$scope.update = function() {
			var rx = $scope.rx ;

			rx.$update(function() {
				$location.path('rxes/' + rx._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rxes
		$scope.find = function() {
			$scope.rxes = Rxes.query();
		};

		// Find existing Rx
		$scope.findOne = function() {
			$scope.rx = Rxes.get({ 
				rxId: $stateParams.rxId
			});
		};
	}
]);