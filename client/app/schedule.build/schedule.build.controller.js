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
      job.slots.push({});
      $scope.setDate();
    };

    $scope.removeJob = function(index) {
      $scope.clearJob();
      $scope.schedule.jobs.splice(index, 1);
    };

    $scope.removeSlot = function(job, index) {
      job.slots.splice(index, 1);
    };

    $scope.blindify = function() {
      console.log("blind date?" + $scope.blindDate);
      $scope.blindDate = !$scope.blindDate;
      $scope.setDate();
    };
    
    //#######################
    //####HERE BE DRAGONS####
    //#######################
    //
    // $scope.conflict = function(s) {
    //   //temp = slots[0];
    //   //console.log("you suck at progframming and spelling");
    //   //for(var i = 0;i<slots.length;i++){
    //  // console.log('slots: ' + slots[i] = ((int) slots[i].start.valueOf().replace(/[^0123456789]*/g,"")));
    //  //   console.log('has type: ' + typeof(slots[i].start.valueOf().replace(/[^0123456789]*/g,"")));}
    //   for(var i = 1;i<s.length;i++){
    //
    //     //console.log("#################GOT HERE##########3");
    //    // console.log("the valueOf you are using is: "+slots[i].start.valueOf().replace(/[^0123456789]*/g,""));
    //     console.log("the end toString you are using is: "+s[i].start.toString().replace(/[^0123456789]|^.*-.*-../g,""));
    //     console.log("the end you are using is: "+s[i].start.toString());
    //     console.log("the end toString you are using is: "+s[i].end.toString().replace(/[^0123456789]|^.*-.*-../g,""));
    //     console.log("the end you are using is: "+s[i].end.toString());
    //     // console.log("the stringify you are using is: "+JSON.stringify(slots[i].start));
    //     var b = (((s[i].start.toString().replace(/[^0123456789]|^.*-.*-../g,"")<s[0].start.toString().replace(/[^0123456789]|^.*-.*-../g,""))&&(s[i].end.toString().replace(/[^0123456789]|^.*-.*-../g,"")<s[0].start.toString().replace(/[^0123456789]|^.*-.*-../g,"")))||
    //     ((s[i].end.toString().replace(/[^0123456789]|^.*-.*-../g,"")>s[0].end.toString().replace(/[^0123456789]|^.*-.*-../g,""))&&(s[i].start.toString().replace(/[^0123456789]|^.*-.*-../g,"")>s[0].end.toString().replace(/[^0123456789]|^.*-.*-../g,""))));
    //     //(((slots[i].start.valueOf().replace(/[^0123456789]*/g,"")<=slots[0].start.valueOf().replace(/[^0123456789]*/g,""))&&(slots[i].end.valueOf().replace(/[^0123456789]*/g,"")<slots[0].start.valueOf().replace(/[^0123456789]*/g,"")))||
    //       //((slots[i].end.valueOf().replace(/[^0123456789]*/g,"")>=slots[0].end.valueOf().replace(/[^0123456789]*/g,""))&&(slots[i].start.valueOf().replace(/[^0123456789]*/g,"")>slots[0].end.valueOf().replace(/[^0123456789]*/g,"")))){
    //     if(b){
    //       console.log("did the other if: " + b);
    //       //throw "it worked?";
    //     }else{
    //       console.log("the error is about to happen, get ready!!!");
    //       throw "YOU fun DUCKED UP ERROR: your schedule is bad and you should feel bad";
    //     }
    //   }
    // }
    //
    // $scope.anthronyh = function(slots) {
    //   //console.log('slo65ts: ' + JSON.stringify(slots));
    //   //console.log('slo65ts has type(length): ' + slots.length);
    //   var myfish = 0;
    //   myfish = slots;
    // //  console.log('myfish has type: '+typeof(myfish));
    //   if(slots.length<2){return "all is good in the world";}
    //   console.log("did the if");
    //   $scope.conflict(myfish);
    //   var temp = myfish.length;
    //   myfish = [];
    //   for(var i = slots.length-temp + 1;i<slots.length;i++){
    //     myfish[i - temp - 1] = slots[i];
    //   }
    //   //myfish.shift();
    //   console.log('slo9ts: ' + slots);
    //   $scope.anthronyh(myfish);
    // }
    //
    // $scope.joe = function(slots) {
    //   var myfish = 0;
    //   myfish = slots;
    //   myfish.forEach(function(x){$scope.anthronyh(x.slots)});
    //   //$scope.anthronyh(slots);
    // //  for(var i = 0;i<slots.length;i++){
    //  //   console.log("the type here is: "+JSON.stringify(slots[i].slots));
    //   //  $scope.anthronyh(slots[i]);}
    //   return "$scope.schedule.jobs.save({})";
    // }

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

    //Removes all assigned people.
    $scope.clearJob = function() {
      for(var i = 0; i<$scope.schedule.jobs.length; i++){
        var job = $scope.schedule.jobs[i];
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

  });
