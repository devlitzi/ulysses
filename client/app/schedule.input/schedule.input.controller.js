'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleInputCtrl', function ($scope, papa, $state) {
    $scope.schedule = null;
    $scope.teamCSV = null;
    $scope.volunteerCSV = null;
    $scope.conflicts = {};
    $scope.unresolvables = 0;
    $scope.detail = null;
    $scope.allVolunteers = [];

    $scope.$parent.schedule.$promise.then(function(schedule) {
      $scope.schedule = schedule;
    });

    $scope.count = function(object) {
      return Object.keys(object).length;
    };

    $scope.open = function(volunteer) {
      $scope.detail = volunteer;
    };

    $scope.close = function() {
      $scope.detail = null;
    };

    $scope.addVolunteer = function() {
      var unassigned = $scope.schedule.unassigned;
      unassigned.unshift({});
      $scope.detail = unassigned[0];
    };

    $scope.removeVolunteer = function(volunteer) {
      var unassigned = $scope.schedule.unassigned;
      for(var i in $scope.schedule.jobs){
        var job = $scope.schedule.jobs[i];
        for(var j in job.slots){
          var slot = job.slots[j];
          for(var k in slot.assigned){
            var aVol = slot.assigned[k];
            console.log(aVol);
            if(aVol == volunteer){
              //<!--<button ng-click="$scope.emailVolunteer()" type="button" class="btn btn-success">Email Volunteer</button>-->
          }
        }
      }
      unassigned.splice(unassigned.indexOf(volunteer), 1);
    };
  }

    $scope.process = function(data) {
      if ($scope.volunteerCSV) {
        papa.parse($scope.volunteerCSV, {
          header: true,
          step: function(result) {
            $scope.schedule.unassigned.push(birthVolunteer(result.data[0]));
          },
          complete: function() {
              $scope.$apply();
          }
        });
      }
    };

    $scope.processTeams = function(data) {
      console.log("got to processTeams");

      var divisions = {
        Primary: 0, //primary listed as 1's in csv? Error?
        I: 1,
        II: 2,
        III: 3,
        IV: 4
      };

      if ($scope.teamCSV) {
        papa.parse($scope.teamCSV, {
          header: true,
          step: function(result) {
            var row = result.data[0];
            $scope.conflicts['#' + row['Number'] + ' ' + row['Problem'] + '/' + divisions[row['Division']]] = {
              start: moment(row['Longt Time'], 'h:mm A').subtract(15, 'minutes'),
              end: moment(row['Longt Time'], 'h:mm A').add(45, 'minutes')
            };

          },
          complete: function() {
            $scope.$apply();
          }
        });
      }
    };

    $scope.addConstraints = function() {
      for(var index in $scope.schedule.unassigned){
        var volunteer = $scope.schedule.unassigned[index];
        if (volunteer.childTeam) {
          var teams = volunteer.childTeam.split(", ");
          teams.forEach(function(team){
            if(team in $scope.conflicts) {
              volunteer.constraints.push($scope.conflicts[team]);
            }
            else {
              $scope.unresolvables++;
            }
          });
        }
      }
    };

    var fullName = function(first, last){
      return [first, last].join(" ");
    };

    var birthVolunteer = function(row) {
      return {
        name: fullName(row["First name"], row["Last name"]),
        email: row["E-mail"],
        phone: row["phone"],
        username: row["username"],
        password: row["password"],
        childTeam: row["child_team"],
        constraints: [],
        comments: row["comment"],
        shirt: row["T-shirt"],
        positions: [],
        isJudge: row[""] == "AS_JUDGE",
        preference1: row["Job Preference #1"],
        preference2: row["Job Preference #2"]
      };
    };

    $scope.timeRange = function(constraint) {
      var start = moment(constraint.start);
      var end = moment(constraint.end);

      return start.format('h:mma') + ' to ' + end.format('h:mma');
    };

//     =====================================================================================================
//
//      // send email to all volunteers
//      $scope.sendEmails = function(vols){
//      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
//      '&to=' + vols.to +
//      '&su=' + vols.subject +
//      '&body=' + vols.message +
//      '&ui=1';
//      $window.open(str);
//      };
// //////////////////////////////////////////////
//      $scope.emailAllVolunteers = function() {
//      var emailList = "";
//      $scope.data.forEach(function(volunteer) {
//      emailList += volunteer.email + ","
//      });
//      setTimeout(function() {
//      sendEmails({
//      to: emailList,
//      subject: "Volunteer Information for Odyssey of the Mind",
//      message: "Dear Volunteer, %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind"
//
//      });
//      }, 1000);
//
//      };
//
//
//      =============Lower Down Fcts=================
//
//
//      /////////////////////////////////////////////// send email to all volunteers
//      $scope.sendEmail = function(volunteers){
//        console.log("here");
//      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
//      '&to=' + volunteers.to +
//      '&su=' + volunteers.subject +
//      '&body=' + volunteer.message +
//      '&ui=1';
//      $window.open(str);
//      };
//
// ///////////////////////////////////////////////////
//     $scope.emailVolunteer = function() {
//      var jobInfo = "";
//      $scope.job.slots.forEach(function(slotID) {
//      Slot.get({id: slotID}).$promise.then(function(slot) {
//      Job.get({id: slot.jobID}, function(job){
//      $scope.volunteer.locations.forEach(function (location) {
//      if (location.slotID == slotID) {
//      Location.get({id: location.locationID}, function (location2) {
//      slot.location = location2.name;
//      console.log("this is the location: " + slot.location);
//      jobInfo += "Job Title: " + job.title + "%0D%0AStart Time: " + $scope.parseTime(slot.start) + "%0D%0AEnd Time: " + $scope.parseTime(slot.end) + "%0D%0ALocation: " + slot.location + "%0D%0A%0D%0A";
//      })
//      }
//      });
//      });
//      }, function(error) {
//      console.log("ERROR");
//      });
//      });
//
//      console.log("what is $scope.volunteer? " + jobInfo);
//      setTimeout(function() {
//      sendEmail({
//      to: $scope.volunteer.email,
//      subject: "Volunteer Information for Odyssey of the Mind",
//      message: "Dear " + $scope.volunteer.firstName + "," + "%0D%0A%0D%0A" + "Thank you for your participation in this event! Our records show your team of interest is "
//      + $scope.volunteer.childTeam.substring(1) + ".%0D%0A%0D%0A"
//      + "You have been assigned to the following:%0D%0A%0D%0A"
//      + jobInfo + "You can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind"
//
//      });
//      }, 1000);
//
//      };


  });
