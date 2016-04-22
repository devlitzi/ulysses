'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleCtrl', function ($scope, $state, Schedule, $stateParams) {
    $scope.schedule = Schedule.get($stateParams);

    $scope.continue = function(destination) {
      $scope.schedule.$save()
        .then(function() {
          if (destination) {
            $state.go(destination, { id: $scope.schedule._id });
          }
        }, function() {
          console.log('An error happened / You write terrible software / Life is meaningless');
        });
    };
    // 
    // $scope.fixNavbar = function() {
    //     if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    //         document.getElementById("myDiv").className = "fixedTop";
    //     } else {
    //         document.getElementById("myDiv").className = "fixedUnderNavbar";
    //     }
    // }
    // window.onscroll = function() {
    //   $scope.fixNavbar();
    // }
  });
