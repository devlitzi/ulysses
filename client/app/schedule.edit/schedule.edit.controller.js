'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleEditCtrl', function ($scope, moment) {
    $scope.schedule = null;
    $scope.earlyTime = new Date('April 13, 2016, 07:00:00');

    $scope.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;
    });

    $scope.auto = function() {
      var unassigned = $scope.schedule.unassigned;
      unassigned.sort(function(a, b) {return b.constraints.length - a.constraints.length})
      //Separate judging and non-judging jobs:
      var jobs = {
        judging: $scope.schedule.jobs.filter(function(job) {
          return job.isJudging;
        }),
        nonjudging: $scope.schedule.jobs.filter(function(job) {
          return !job.isJudging;
        })
      };
      //iterate through all unassigned volunteers
      //for (var volunteer in unassigned){
      console.log("unassigned volunteers: " + unassigned.length);
      //for(var volunteer=0;volunteer<90;volunteer++){
      var volunteer=0;
      var temp;
      var temp0;
      var len = unassigned.length;
      while(unassigned.length>0){
        console.log("volunteer is: " + volunteer);
        // if a volunteer is a judge and the judge positions have openings, put them in first
        if (unassigned[volunteer].isJudge && judgingHasOpening(jobs)) {
          jobs = fillFirstJudgingSpot(unassigned[volunteer], jobs);
        } else {
          jobs = fillNonJudgingSpot(unassigned[volunteer], jobs);
        }
      }
      if(temp=unassigned.length){temp0++;}else{temp0=0;}
      if(temp0>len){break;}
    }

    //Checks to see if there is an open job in judging
    var judgingHasOpening = function(jobs){
      var totalPositions = 0;
      var totalFilledPositons = 0;
      for (var job in jobs.judging) {
        for (var slot in jobs.judging[job].slots) {
          totalPositions += jobs.judging[job].slots[slot].positions;
          totalFilledPositons += jobs.judging[job].slots[slot].assigned.length;
        }
      }
      return totalPositions > totalFilledPositons
    };

    //fills first empty judging spot, if there isn't one available, does nothing
    var fillFirstJudgingSpot = function(volunteer, jobs){
      for (var job in jobs.judging) {
        for (var slot in jobs.judging[job].slots) {
          if (jobs.judging[job].slots[slot].positions > jobs.judging[job].slots[slot].assigned.length){
            jobs.judging[job].slots[slot].assigned.push(volunteer);
            $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(volunteer), 1);
            return jobs;
          }
        }
      }
    };

    //fills first non-judging spot, if there isn't one available, does nothing
    var fillNonJudgingSpot = function(volunteer, jobs){
      for (var job in jobs.nonjudging) {
        for (var slot in jobs.nonjudging[job].slots) {
          if (jobs.nonjudging[job].slots[slot].positions > jobs.nonjudging[job].slots[slot].assigned.length){
            jobs.nonjudging[job].slots[slot].assigned.push(volunteer);
            $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(volunteer), 1);
            return jobs;

          }
        }
      }
    };

    $scope.duration = function(time1, time2){
      return time2.getHours()-time1.getHours() + Math.abs(time2.getMinutes()-time1.getMinutes())/60;
    }

    //Removes all assigned people.
    $scope.unLucky = function() {
      //console.log($scope.schedule.jobs);
      for(var i = 0; i<$scope.schedule.jobs.length; i++){
        var job = $scope.schedule.jobs[i];
        //console.log(job.name);
        for(var j = 0; j<job.slots.length; j++){
          var slot = job.slots[j];
          //console.log(slot.start);
          for(var k = 0; k<slot.assigned.length; k++){
            var vol = slot.assigned[k];
            var volThing = slot.assigned.indexOf(vol)
            //console.log(vol.name);
            $scope.schedule.unassigned.push(vol);
          }
          slot.assigned = [];
        }
      }
    }

    $scope.helperFunction = function(constraint, slot){
      var count = 0;
      var con = constraint;
      var start = new Date(con.start);
      var end = new Date(con.end);
      var sStart = new Date(slot.start);
      var sEnd = new Date(slot.end);
      var conStart = $scope.duration($scope.earlyTime, start);
      var conEnd = $scope.duration($scope.earlyTime, end);
      var slotStart = $scope.duration($scope.earlyTime, sStart);
      var slotEnd = $scope.duration($scope.earlyTime, sEnd);
      if(((conStart >= slotStart)&&(conStart <= slotEnd)) || ((conEnd >= slotStart) &&(conEnd <= slotEnd))){
        count++;
      } else {
        //do nothing
      }
      return count;
    }

    $scope.populateIndivSlot = function(slot, job){
      var dif = slot.positions - slot.assigned.length;
      for(var k in $scope.schedule.unassigned){
        var vol = $scope.schedule.unassigned[k];
        // console.log(vol.name);
        if(dif != 0){
          if(!job.isJudging && !vol.isJudge){
            if(vol.constraints.length>0){
              for(var l in vol.constraints){
                var con = vol.constraints[l];
                var count = $scope.helperFunction(con, slot);
                if(count != 0){
                  count = 0;
                } else {
                  slot.assigned.push(vol);
                  $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(vol), 1);
                  dif--;
              }
            }
          } else {
            slot.assigned.push(vol);
            $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(vol), 1);
            dif--;
          }
        } else if(job.isJudging && vol.isJudge){
          if(vol.constraints.length>0){
            for(var l in vol.constraints){
              var con = vol.constraints[l];
              var count = $scope.helperFunction(con);
              if(count != 0){
                count = 0;
                } else {
                slot.assigned.push(vol);
                $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(vol), 1);
                dif--;
              }
            }
          } else {
          slot.assigned.push(vol);
          $scope.schedule.unassigned.splice($scope.schedule.unassigned.indexOf(vol), 1);
          dif--;
          }
        } else {
          //do nothing
        }
      }
    }
  }


    $scope.timeRange = function(slot) {
      var start = moment(slot.start);
      var end = moment(slot.end);

      return start.format('h:mma') + ' to ' + end.format('h:mma');
    };
  });
