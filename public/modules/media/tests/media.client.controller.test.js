'use strict';

(function() {
	// Media Controller Spec
	describe('Media Controller Tests', function() {
		// Initialize global variables
		var MediaController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Media controller.
			MediaController = $controller('MediaController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Medium object fetched from XHR', inject(function(Media) {
			// Create sample Medium using the Media service
			var sampleMedium = new Media({
				name: 'New Medium'
			});

			// Create a sample Media array that includes the new Medium
			var sampleMedia = [sampleMedium];

			// Set GET response
			$httpBackend.expectGET('media').respond(sampleMedia);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.media).toEqualData(sampleMedia);
		}));

		it('$scope.findOne() should create an array with one Medium object fetched from XHR using a mediumId URL parameter', inject(function(Media) {
			// Define a sample Medium object
			var sampleMedium = new Media({
				name: 'New Medium'
			});

			// Set the URL parameter
			$stateParams.mediumId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/media\/([0-9a-fA-F]{24})$/).respond(sampleMedium);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.medium).toEqualData(sampleMedium);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Media) {
			// Create a sample Medium object
			var sampleMediumPostData = new Media({
				name: 'New Medium'
			});

			// Create a sample Medium response
			var sampleMediumResponse = new Media({
				_id: '525cf20451979dea2c000001',
				name: 'New Medium'
			});

			// Fixture mock form input values
			scope.name = 'New Medium';

			// Set POST response
			$httpBackend.expectPOST('media', sampleMediumPostData).respond(sampleMediumResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Medium was created
			expect($location.path()).toBe('/media/' + sampleMediumResponse._id);
		}));

		it('$scope.update() should update a valid Medium', inject(function(Media) {
			// Define a sample Medium put data
			var sampleMediumPutData = new Media({
				_id: '525cf20451979dea2c000001',
				name: 'New Medium'
			});

			// Mock Medium in scope
			scope.medium = sampleMediumPutData;

			// Set PUT response
			$httpBackend.expectPUT(/media\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/media/' + sampleMediumPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mediumId and remove the Medium from the scope', inject(function(Media) {
			// Create new Medium object
			var sampleMedium = new Media({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Media array and include the Medium
			scope.media = [sampleMedium];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/media\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMedium);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.media.length).toBe(0);
		}));
	});
}());