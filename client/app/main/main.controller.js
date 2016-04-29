'use strict';

angular.module('ulyssesApp')
  .controller('MainController', function ($scope, $state, Schedule, $stateParams) {
    $scope.schedule = Schedule.get($stateParams);
    $scope.schedules = Schedule.query();

    $scope.addSchedule = function() {
      if($scope.scheduleName.length > 0) {
        Schedule.save({name: $scope.scheduleName});
        $scope.schedules = Schedule.query();
        $scope.scheduleName = "";
        location.reload(true);
      }
    }

  });
