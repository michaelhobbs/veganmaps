angular.
  module('locationDetail').
  component('locationDetail', {
    template: '<a href="#/">TBD: Detail view for <span>{{$ctrl.locationId}}</span><span> with name {{$ctrl.locationDetails.name}}</span><span> and distance {{$ctrl.locationDetails.distance}}</span></a>',
    controller: ['$routeParams', 'LocationService',
      function locationDetailController($routeParams, LocationService) {
        var ctrl = this;
        ctrl.locationId = $routeParams.locationId;
        ctrl.LocationService = LocationService;

        if (ctrl.LocationService.lastSearch && ctrl.LocationService.lastSearch.results) {
          ctrl.locationDetails = ctrl.LocationService.lastSearch.results.find(function(place) {
            return (place._id === ctrl.locationId);
          });
        }
        else {
          ctrl.locationDetails = {name: "[ERROR: unable to find requested location]"};
          // TODO: Here a user has copied the URL linking to this specific
          // restaurant, but the App has not been initialized yet.
          // We need to fetch the locationDetails from the server in this case.
        }
      }
    ]
  });
