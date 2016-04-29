'use strict';

describe('Controller: MainController', function() {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var scope;
  var MainController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $state) {
    scope = $rootScope.$new();
    state = $state;
    MainController = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should not do anything because', function() {
    expect(1).toEqual(1);
  });
});
