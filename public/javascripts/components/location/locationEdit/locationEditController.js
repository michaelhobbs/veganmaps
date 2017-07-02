define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');
  var moment = require('moment');

  function locationEditController($routeParams, $http, $log, $scope, $mdToast, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.oriLocation = (ctrl.LocationService.currentLocation && Object.keys(ctrl.LocationService.currentLocation).length) ? ctrl.LocationService.currentLocation : ctrl.locationDetails;
    
  };

  return ['$routeParams', '$http', '$log', '$scope', '$mdToast', 'LocationService', locationEditController];

});
