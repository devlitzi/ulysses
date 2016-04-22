'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleEditAssignCtrl', function ($scope, $state, $stateParams) {
    $scope.schedule = null;
    $scope.job = null;
    $scope.slot = null;

    $scope.$parent.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;

      // This is horrible, but whatever:

      $scope.schedule.jobs.forEach(function(job) {
        if (job._id == $stateParams.job) {
          $scope.job = job;
        }
      });

      $scope.job.slots.forEach(function(slot) {
        if (slot._id == $stateParams.slot) {
          $scope.slot = slot;
        }
      });
    });

    $scope.assign = function(volunteer, slot) {
      var unassigned = $scope.schedule.unassigned;

      // AH, PUSH IT
      slot.assigned.push(unassigned.splice(unassigned.indexOf(volunteer), 1)[0]);
    };

    $scope.remainingPositions = function(slot) {
      var remaining = slot.positions - slot.assigned.length;
      return Array(remaining < 0 ? 0 : remaining);
    };

    $scope.unassign = function(volunteer, slot) {
      var assigned = slot.assigned;

      // PUSH IT REAL GOOD
      $scope.schedule.unassigned.push(assigned.splice(assigned.indexOf(volunteer), 1)[0]);
    };

    $scope.timeConvert = function(slot) {
      var start = moment(slot.start);
      var end = moment(slot.end);

      return start.format('h:mma') + ' to ' + end.format('h:mma');
    };
    /*
    =====================================================================================================

     // send email to all volunteers
     $scope.sendEmails = function(vols){
     var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
     '&to=' + vols.to +
     '&su=' + vols.subject +
     '&body=' + vols.message +
     '&ui=1';
     $window.open(str);
     };
//////////////////////////////////////////////
     $scope.emailAllVolunteers = function() {
     var emailList = "";
     $scope.data.forEach(function(volunteer) {
     emailList += volunteer.email + ","
     });
     setTimeout(function() {
     sendEmails({
     to: emailList,
     subject: "Volunteer Information for Odyssey of the Mind",
     message: "Dear Volunteer, %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind"

     });
     }, 1000);

     };


     =============Lower Down Fcts=================


     /////////////////////////////////////////////// send email to all volunteers
     $scope.sendEmail = function(vols){
     var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
     '&to=' + vols.to +
     '&su=' + vols.subject +
     '&body=' + vols.message +
     '&ui=1';
     $window.open(str);
     };

///////////////////////////////////////////////////
    $scope.emailVolunteer = function() {
     var jobInfo = "";
     $scope.volunteer.slots.forEach(function(slotID) {
     Slot.get({id: slotID}).$promise.then(function(slot) {
     Job.get({id: slot.jobID}, function(job){
     $scope.volunteer.locations.forEach(function (location) {
     if (location.slotID == slotID) {
     Location.get({id: location.locationID}, function (location2) {
     slot.location = location2.name;
     console.log("this is the location: " + slot.location);
     jobInfo += "Job Title: " + job.title + "%0D%0AStart Time: " + $scope.parseTime(slot.start) + "%0D%0AEnd Time: " + $scope.parseTime(slot.end) + "%0D%0ALocation: " + slot.location + "%0D%0A%0D%0A";
     })
     }
     });
     });
     }, function(error) {
     console.log("ERROR");
     });
     });

     console.log("what is $scope.volunteer? " + jobInfo);
     setTimeout(function() {
     sendEmail({
     to: $scope.volunteer.email,
     subject: "Volunteer Information for Odyssey of the Mind",
     message: "Dear " + $scope.volunteer.firstName + "," + "%0D%0A%0D%0A" + "Thank you for your participation in this event! Our records show your team of interest is "
     + $scope.volunteer.childTeam.substring(1) + ".%0D%0A%0D%0A"
     + "You have been assigned to the following:%0D%0A%0D%0A"
     + jobInfo + "You can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind"

     });
     }, 1000);

     };
    */

  });
