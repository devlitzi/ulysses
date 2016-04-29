'use strict';

angular.module('ulyssesApp')
  .controller('MainController', function ($scope, $state, Schedule, $stateParams) {
    $scope.schedule = Schedule.get($stateParams);

    $scope.makesSchedule = function(){
  
    };

  });

