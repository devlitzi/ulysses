'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleBuildCtrl', function($scope) {
    $scope.schedule = null;
    $scope.blindDate = true;

    $scope.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;
    });

    $scope.addJob = function() {
      $scope.schedule.jobs.push({ slots: [{}] });
      $scope.setDate();
    };

    $scope.addSlot = function(job) {
      console.log(date)
      job.slots.push({});
      $scope.setDate();
    };

    $scope.removeJob = function(index) {
      $scope.schedule.jobs.splice(index, 1);
    };

    $scope.removeSlot = function(job, index) {
      job.slots.splice(index, 1);
    };

    $scope.blindify = function() {
      //console.log("blind date?" + $scope.blindDate);
      $scope.blindDate = !$scope.blindDate;
      $scope.setDate();
    };

    $scope.setDate = function() {
      var ourDate = $scope.schedule.date;
      var no = new Date(ourDate);
      $scope.schedule.jobs.forEach(function(job){
        job.slots.forEach(function(slot){
          slot.start = new Date(slot.start);
          slot.end = new Date(slot.end);
          slot.start.setFullYear(no.getFullYear(), no.getMonth(), no.getDate());
          slot.end.setFullYear(no.getFullYear(), no.getMonth(), no.getDate());
          //console.log("start: " + slot.start);
          //console.log("end: " + slot.end);
      })
    })
    };
  });
