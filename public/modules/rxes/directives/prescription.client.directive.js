'use strict';

angular.module('rxes').directive('prescription', [
	function() {
        return {
            restrict: 'E',
            scope: {
                rx: '=',
                position: '='
            },
            templateUrl:'/modules/rxes/templates/prescription.client.template.html',
            link: function(scope, element, attrs){
                scope.eye = scope.rx[scope.position];
            }
        };
	}
]);