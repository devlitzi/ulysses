'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('VolunteerView', {
        url: '/volunteerView/:id',
        templateUrl: 'app/volunteerView/volunteerView.html',
        controller: 'VolunteerViewCtrl'
      });
  });
