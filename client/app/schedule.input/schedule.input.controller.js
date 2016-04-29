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
    $scope.constraintsImported = false;

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
      if($scope.constraintsImported == false){
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
      $scope.constraintsImported = true;
    }

    else{
      return;
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
        $scope.allVolunteers.splice(index,0,array[index]);
      });
console.log("first loop done");
console.log($scope.allVolunteers.length);
      //--------------Assigned portion of volunteers----------------
      $scope.schedule.jobs.forEach(function(element, index, array){

        element.slots.forEach(function(element, index, array){

          element.assigned.forEach(function(element, index, array){

$scope.allVolunteers.splice(index,0,array[index]);

            });
          });
        });

console.log("All Volunteers: " + $scope.allVolunteers[99].email);
console.log($scope.allVolunteers);
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
      $scope.allVolunteers.forEach(function(element, index, array){
        console.log("index: " + index);
        //console.log("unassigned: " + array);
        console.log("element: " + element.email);
        //volunteer = $scope.schedule.unassigned[index];
        emailList += array[index].email + ","

      });
      return emailList;
    };
    $scope.createEmailListUnassigned = function(){
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
    $scope.sendEmailsUnassigned = function(volunteers){
      if($scope.createEmailListUnassigned().length != 0){
      console.log("hi");
      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + $scope.createEmailListUnassigned() +
      '&su=' + "Volunteer Information for Odyssey of the Mind" +
      '&body=' + "Dear Volunteer, %0D%0A%0D%0AThank you for your willingness to volunteer, unfortunately we have more volunteers than expected and we have no need for your help this year. Thank you for your interest!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ .%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind" +
      '&ui=1';
      $window.open(str);
    }
    else{
      $window.alert("There are no unassigned volunteers to email! All volunteers are assigned or you have not imported them.")
    }
    };

    $scope.sendEmails = function(volunteers){
      console.log("hi");
      if($scope.createEmailList().length != 0){
      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + $scope.createEmailList() +
      '&su=' + "Volunteer Information for Odyssey of the Mind" +
      '&body=' + "Dear Volunteer, %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ .%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind" +
      '&ui=1';
      $window.open(str);
    }
    else{
      $window.alert("There are no volunteers to email! Import a volunteer CSV to begin scheduling.");
    }
    };


  //  =============Email Fcts for Single Volunteer=================
    $scope.sendEmail = function(email, name){
      console.log("here");
      var str = 'http://mail.google.com/mail/?view=cm&fs=1'+
      '&to=' + email +
      '&su=' + "Volunteer Information for Odyssey of the Mind" +
      '&body=' + "Dear " +  name + ", %0D%0A%0D%0AThank you for your participation in this event!%0D%0A%0D%0AYou can log in to see your schedule at http://localhost:9000/ using the email " + email + ".%0D%0A%0D%0ASincerely,%0D%0A%0D%0AOdyssey of the Mind" +
      '&ui=1';
      $window.open(str);
    };
  });
