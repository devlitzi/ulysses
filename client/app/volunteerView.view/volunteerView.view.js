'use strict';

angular.module('ulyssesApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('volunteerView.view', {
        url: '/:id',
        templateUrl: 'app/VolunteerView.view/VolunteerView.view.html',
        controller: 'VolunteerViewViewCtrl'
      });
  });
