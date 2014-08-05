'use strict';

// Rxes controller
angular.module('rxes').controller('RxesController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Rxes', 'Prescriptions',
    function($scope, $stateParams, $location, Authentication, Rxes, Prescriptions) {
        $scope.authentication = Authentication;

        $scope.scopedRx = {
            rightEye: {},
            leftEye: {}
        };

        // Create new Rx
        $scope.create = function() {
            //create eye objects
            var leftEye = new Prescriptions($scope.scopedRx.leftEye);
            var rightEye = new Prescriptions($scope.scopedRx.rightEye);

            //create containers for prescription ids
            var rightEyeId = '';
            var leftEyeId = '';

            //save eye objects
            leftEye.$save(function(response) {
                leftEyeId = response._id;

                rightEye.$save(function(response) {
                    rightEyeId = response._id;

                    // Create new Rx object
                    var rx = new Rxes ({
                        rightEye: rightEyeId,
                        leftEye: leftEyeId
                    });

                    // Redirect after save
                    rx.$save(function(response) {
                        $location.path('rxes/' + response._id);
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

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