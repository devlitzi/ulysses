'use strict';

describe('Controller: VolunteerViewViewCtrl', function () {

  // load the controller's module
  beforeEach(module('ulyssesApp'));

  var VolunteerViewViewCtrl, scope, parentScope, childScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $compile) {
    scope = $rootScope.$new();
    ScheduleViewCtrl = $controller('VolunteerViewViewCtrl', {
      $scope: scope

      parentScope = VolunteerViewCtrl.scope;
      childScope = VolunteerViewViewCtrl.scope;
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
