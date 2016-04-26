'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleInputCtrl', function ($scope, papa, $state, $window) {
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
          }
        }
      }
      unassigned.splice(unassigned.indexOf(volunteer), 1);
    };
  }

    $scope.process = function(data) {
      if ($scope.schedule.unassigned <= 0){
        console.log("first one")
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
      }
      if ($scope.schedule.unassigned > 0){
        for (var i = 0; i < $scope.schedule.unassigned; i++) {
         $scope.schedule.unassigned.email
         console.log($scope.schedule.unassigned.email)
       }

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
              team: row['Number'],
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

    //===================All Volunteer Array====================================
    $scope.createallVolunteerArray = function(){

      //---------Unassigned portion of volunteers-------------------
      $scope.schedule.unassigned.forEach(function(element, index, array){
        console.log("index: " + index);
        //console.log("unassigned: " + array);
        console.log("element: " + element.email);
        //volunteer = $scope.schedule.unassigned[index];
        $scope.allVolunteers += array[index];
      });

      //--------------Assigned portion of volunteers----------------
      $scope.schedule.jobs.forEach(function(element, index, array){

        element.slots.forEach(function(element, index, array){

          element.assigned.forEach(function(element, index, array){

$scope.allVolunteers += array[index];

            });
          });
        });

console.log("All Volunteers: " + $scope.allVolunteers);
    };


    // $scope.teamFix = function(){
    //   forEach(volunteer in $scope.schedule.unassigned){
    //
    //   }
    // }


    //=============Email Fcts for Multiple Volunteers===========================

    // send email to all volunteers
    $scope.createEmailList = function(){
      var emailList = "";
    //  var volunteer = null;
      $scope.schedule.unassigned.forEach(function(element, index, array){
        console.log("index: " + index);
        //console.log("unassigned: " + array);
        console.log("element: " + element.email);
        //volunteer = $scope.schedule.unassigned[index];
        emailList += array[index].email + ","

      });
      return emailList;
    };

    $scope.sendEmails = function(volunteers){
      console.log("hi");
      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + $scope.createEmailList() +
      '&su=' + "Volunteer Information for Odyssey of the Mind" +
      '&body=' + "Dear Volunteer, %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind" +
      '&ui=1';
      $window.open(str);
    };
    //-----------------------------------------------------------
    $scope.emailAllVolunteers = function() {
    //  console.log(emailList);
      setTimeout(function() {
        $scope.sendEmails({
          to: $scope.createEmailList(),
          subject: "Volunteer Information for Odyssey of the Mind",
          message: "Dear Volunteer, %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ using the email \"peter@example.com\" and the password \"peter\".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind"
         });
      }, 1000);
    };


  //  =============Email Fcts for Single Volunteer=================
    $scope.sendEmail = function(volunteers){
      console.log("here");
      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + volunteers.to +
      '&su=' + volunteers.subject +
      '&body=' + volunteer.message +
      '&ui=1';
      $window.open(str);
    };

    //------------------------------------------------
    $scope.emailVolunteer = function() {
      console.log("hi");
      var jobInfo = "";
      // $scope.job.slots.forEach(function(slotID) {
      //   Slot.get({id: slotID}).$promise.then(function(slot) {
      //     Job.get({id: slot.jobID}, function(job){
      //       $scope.volunteer.locations.forEach(function (location) {
      //         if (location.slotID == slotID) {
      //           Location.get({id: location.locationID}, function (location2) {
      //             slot.location = location2.name;
      //             console.log("this is the location: " + slot.location);
      //             jobInfo += "Job Title: " + job.title + "%0D%0AStart Time: " + $scope.parseTime(slot.start) + "%0D%0AEnd Time: " + $scope.parseTime(slot.end) + "%0D%0ALocation: " + slot.location + "%0D%0A%0D%0A";
      //           })
      //         }
      //       });
      //     });
      //   }, function(error) {
      //     console.log("ERROR");
      //   });
      // });



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
  });
