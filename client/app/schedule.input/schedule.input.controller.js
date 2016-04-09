'use strict';

angular.module('ulyssesApp')
  .controller('ScheduleInputCtrl', function ($scope, $stateParams, papa, Schedule, $state) {
    $scope.schedule = Schedule.get($stateParams);
    $scope.teamCSV = null;
    $scope.volunteerCSV = null;

    $scope.add = function() {
      $scope.schedule.unassigned.unshift({});
    };

    $scope.remove = function(index) {
      $scope.schedule.unassigned.splice(index, 1);
    };

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

      var conflicts = {};
      var divisions = {
        Primary: 0,
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
            conflicts['#' + row['Number'] + ' ' + row['Problem'] + '/' + divisions[row['Division']]] = {
              start: moment(row['Longt Time'], 'h:mm A').subtract(15, 'minutes'),
              end: moment(row['Longt Time'], 'h:mm A').add(45, 'minutes')
            };
            console.log(conflicts.start);
          },
          complete: function() {
            $scope.$apply();
            console.log(conflicts);
          }
        });
      }
    };

    $scope.addConstraints = function() {

    }

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
        preferences: []
      };
    };

    $scope.save = function() {
      $scope.schedule.$save()
        .then(function() {
          $state.go('^.edit');
        }, function() {
          console.log('An error happened / You write terrible software / Life is meaningless');
        });
    };

  });
