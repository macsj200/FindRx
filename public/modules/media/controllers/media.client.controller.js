'use strict';

// Media controller
angular.module('media').controller('MediaController', ['$scope', '$stateParams', '$upload', '$location', 'Authentication', 'Media',
    function($scope, $stateParams, $upload, $location, Authentication, Media ) {
        $scope.authentication = Authentication;

        //file upload controller code
        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/media', //upload.php script, node.js route, or servlet url
                    //method: 'POST' or 'PUT',
                    //headers: {'header-key': 'header-value'},
                    //withCredentials: true,
                    data: {},
                    file: file // or list of files ($files) for html5 only
                    //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                    // customize file formData name ('Content-Desposition'), server side file variable name.
                    //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                    // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                    //formDataAppender: function(formData, key, val){}
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.mediaRes = data;
                });
            }
        };

        // Create new Medium
        $scope.create = function() {
            // Create new Medium object
            var medium = new Media ({
                name: this.name
            });

            // Redirect after save
            medium.$save(function(response) {
                $location.path('media/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.name = '';
        };

        // Remove existing Medium
        $scope.remove = function( medium ) {
            if ( medium ) { medium.$remove();

                for (var i in $scope.media ) {
                    if ($scope.media [i] === medium ) {
                        $scope.media.splice(i, 1);
                    }
                }
            } else {
                $scope.medium.$remove(function() {
                    $location.path('media');
                });
            }
        };

        // Update existing Medium
        $scope.update = function() {
            var medium = $scope.medium ;

            medium.$update(function() {
                $location.path('media/' + medium._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Media
        $scope.find = function() {
            $scope.media = Media.query();
        };

        // Find existing Medium
        $scope.findOne = function() {
            $scope.medium = Media.get({
                mediumId: $stateParams.mediumId
            });
        };
    }
]);