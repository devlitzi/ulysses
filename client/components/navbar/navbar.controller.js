'use strict';

class NavbarController {
  isCollapsed = true;
  scheduleDropdown = false;

  constructor($scope, Auth, Schedule, $rootScope, $location) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.hasRole = Auth.hasRole;
    this.getCurrentUser = Auth.getCurrentUser;
    $scope.schedules = Schedule.query();

      //deletes the schedule and takes user to the main page
      $rootScope.deleteSchedule = function(schedule) {
          if (confirm("Are you SURE you want to delete the schedule?")) {
            Schedule.remove({id: schedule._id}).$promise.then(function() {
              $scope.schedules = Schedule.query();
              $location.path('main');
            });
          }
        };

  }
}

angular.module('ulyssesApp')
  .controller('NavbarController', NavbarController);
