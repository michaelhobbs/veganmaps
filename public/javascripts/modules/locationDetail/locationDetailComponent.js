angular.
  module('locationDetail').
  component('locationDetail', {
    templateUrl: '/javascripts/modules/locationDetail/locationDetailTemplate.html',
    bindings: {
      locationDetails: '<'
    },
    controller: ['$routeParams', '$http', 'LocationService',
      function locationDetailController($routeParams, $http, LocationService) {
        var ctrl = this;
        ctrl.locationId = $routeParams.locationId;
        ctrl.LocationService = LocationService;

        if (ctrl.LocationService.lastSearch && ctrl.LocationService.lastSearch.results) {
          ctrl.locationDetails = ctrl.LocationService.lastSearch.results.find(function(place) {
            return (place._id === ctrl.locationId);
          });
        }
      }
    ]
  });
