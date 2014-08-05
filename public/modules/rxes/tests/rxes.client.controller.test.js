'use strict';

(function() {
	// Rxes Controller Spec
	describe('Rxes Controller Tests', function() {
		// Initialize global variables
		var RxesController,
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

			// Initialize the Rxes controller.
			RxesController = $controller('RxesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rx object fetched from XHR', inject(function(Rxes) {
			// Create sample Rx using the Rxes service
			var sampleRx = new Rxes({
				name: 'New Rx'
			});

			// Create a sample Rxes array that includes the new Rx
			var sampleRxes = [sampleRx];

			// Set GET response
			$httpBackend.expectGET('rxes').respond(sampleRxes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rxes).toEqualData(sampleRxes);
		}));

		it('$scope.findOne() should create an array with one Rx object fetched from XHR using a rxId URL parameter', inject(function(Rxes) {
			// Define a sample Rx object
			var sampleRx = new Rxes({
				name: 'New Rx'
			});

			// Set the URL parameter
			$stateParams.rxId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rxes\/([0-9a-fA-F]{24})$/).respond(sampleRx);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rx).toEqualData(sampleRx);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rxes) {
			// Create a sample Rx object
			var sampleRxPostData = new Rxes({
				name: 'New Rx'
			});

			// Create a sample Rx response
			var sampleRxResponse = new Rxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Rx'
			});

			// Fixture mock form input values
			scope.name = 'New Rx';

			// Set POST response
			$httpBackend.expectPOST('rxes', sampleRxPostData).respond(sampleRxResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rx was created
			expect($location.path()).toBe('/rxes/' + sampleRxResponse._id);
		}));

		it('$scope.update() should update a valid Rx', inject(function(Rxes) {
			// Define a sample Rx put data
			var sampleRxPutData = new Rxes({
				_id: '525cf20451979dea2c000001',
				name: 'New Rx'
			});

			// Mock Rx in scope
			scope.rx = sampleRxPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rxes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rxes/' + sampleRxPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rxId and remove the Rx from the scope', inject(function(Rxes) {
			// Create new Rx object
			var sampleRx = new Rxes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rxes array and include the Rx
			scope.rxes = [sampleRx];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rxes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRx);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rxes.length).toBe(0);
		}));
	});
}());