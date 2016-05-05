'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleViewCtrl', function ($scope) {
    $scope.hour = 152;
    $scope.schedule = null;
    $scope.earlyTime = new Date('April 13, 2016, 07:00:00');

    $scope.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;
      console.log($scope.schedule);
    });

    $scope.duration = function(time1, time2){
      return time2.getHours()-time1.getHours() + Math.abs(time2.getMinutes()-time1.getMinutes())/60;
    }


    $scope.timeRange = function(slot) {
      var start = moment(slot.start);
      var end = moment(slot.end);

      return start.format('h:mma') + ' to ' + end.format('h:mma');
    };


  });
