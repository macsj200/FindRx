'use strict';

(function() {
	// Prescriptions Controller Spec
	describe('Prescriptions Controller Tests', function() {
		// Initialize global variables
		var PrescriptionsController,
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

			// Initialize the Prescriptions controller.
			PrescriptionsController = $controller('PrescriptionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Prescription object fetched from XHR', inject(function(Prescriptions) {
			// Create sample Prescription using the Prescriptions service
			var samplePrescription = new Prescriptions({
				name: 'New Prescription'
			});

			// Create a sample Prescriptions array that includes the new Prescription
			var samplePrescriptions = [samplePrescription];

			// Set GET response
			$httpBackend.expectGET('prescriptions').respond(samplePrescriptions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.prescriptions).toEqualData(samplePrescriptions);
		}));

		it('$scope.findOne() should create an array with one Prescription object fetched from XHR using a prescriptionId URL parameter', inject(function(Prescriptions) {
			// Define a sample Prescription object
			var samplePrescription = new Prescriptions({
				name: 'New Prescription'
			});

			// Set the URL parameter
			$stateParams.prescriptionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/prescriptions\/([0-9a-fA-F]{24})$/).respond(samplePrescription);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.prescription).toEqualData(samplePrescription);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Prescriptions) {
			// Create a sample Prescription object
			var samplePrescriptionPostData = new Prescriptions({
				name: 'New Prescription'
			});

			// Create a sample Prescription response
			var samplePrescriptionResponse = new Prescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Prescription'
			});

			// Fixture mock form input values
			scope.name = 'New Prescription';

			// Set POST response
			$httpBackend.expectPOST('prescriptions', samplePrescriptionPostData).respond(samplePrescriptionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Prescription was created
			expect($location.path()).toBe('/prescriptions/' + samplePrescriptionResponse._id);
		}));

		it('$scope.update() should update a valid Prescription', inject(function(Prescriptions) {
			// Define a sample Prescription put data
			var samplePrescriptionPutData = new Prescriptions({
				_id: '525cf20451979dea2c000001',
				name: 'New Prescription'
			});

			// Mock Prescription in scope
			scope.prescription = samplePrescriptionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/prescriptions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/prescriptions/' + samplePrescriptionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid prescriptionId and remove the Prescription from the scope', inject(function(Prescriptions) {
			// Create new Prescription object
			var samplePrescription = new Prescriptions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Prescriptions array and include the Prescription
			scope.prescriptions = [samplePrescription];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/prescriptions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePrescription);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.prescriptions.length).toBe(0);
		}));
	});
}());