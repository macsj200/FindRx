'use strict';

// Rxes controller
angular.module('rxes').controller('RxesController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Rxes', 'Prescriptions',
    function($scope, $stateParams, $location, Authentication, Rxes, Prescriptions) {
        $scope.authentication = Authentication;

        //Scope variable to store current rx
        //needed to bind data to creation forms
        //kinda yucky todo cleanup
        $scope.scopedRx = {
            rightEye: {},
            leftEye: {}
        };

        //stopgap measure to output scrips prettily
        //basically strips the extra syntax out of json
        //todo get rid of this :) (also fix string concat)
        $scope.outputRx = function(rx){
            //actual string returned by function
            var returnedValue = '';

            //add left and right eye to string
            returnedValue = returnedValue + 'Right eye: ';
            returnedValue = returnedValue + ' Sphere: ' + rx.rightEye.sphere;
            returnedValue = returnedValue + ' Cylinder: ' + rx.rightEye.cylinder;
            returnedValue = returnedValue + ' Axis: ' + rx.rightEye.axis;
            //exact same thing as right eye just string replaced
            returnedValue = returnedValue + ' Left eye: ';
            returnedValue = returnedValue + ' Sphere: ' + rx.leftEye.sphere;
            returnedValue = returnedValue + ' Cylinder: ' + rx.leftEye.cylinder;
            returnedValue = returnedValue + ' Axis: ' + rx.leftEye.axis;

            return returnedValue;
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
            //todo fix this unreadable syntax
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

        // Search for specific Rxes
        //currently just an alias to find
        $scope.search = function(){
            $scope.find();
        };

        // Find existing Rx
        $scope.findOne = function() {
            $scope.rx = Rxes.get({
                rxId: $stateParams.rxId
            });
        };
    }
]);