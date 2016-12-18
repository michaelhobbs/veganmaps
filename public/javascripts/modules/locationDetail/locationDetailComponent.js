angular.
  module('locationDetail').
  component('locationDetail', {
    templateUrl: '/javascripts/modules/locationDetail/locationDetailTemplate.html',
    bindings: {
      locationDetails: '<'
    },
    controller: ['$routeParams', '$http', '$filter', 'LocationService',
      function locationDetailController($routeParams, $http, $filter, LocationService) {
        var ctrl = this;
        ctrl.locationId = $routeParams.locationId;
        ctrl.LocationService = LocationService;
        ctrl.fromSearch = ctrl.LocationService.lastSearch && ctrl.LocationService.lastSearch.results;

        if (ctrl.fromSearch) {
          ctrl.locationDetails = ctrl.LocationService.lastSearch.results.find(function(place) {
            return (place._id === ctrl.locationId);
          });
          ctrl.LocationService.currentLocation = ctrl.locationDetails;


          ctrl.filterExpression = function(value) {
            return (ctrl.LocationService.lastSearch.filterProp === 'all' || value[ctrl.LocationService.lastSearch.filterProp] === true);
          };

//TODO : move filter/orderBy logic to a service
          ctrl.filteredLocations = $filter('filter')(ctrl.LocationService.lastSearch.results, ctrl.filterExpression);
          ctrl.filteredLocations = $filter('orderBy')(ctrl.filteredLocations, ctrl.LocationService.lastSearch.orderProp);
          var index = ctrl.filteredLocations.findIndex(x => x._id === ctrl.locationId);
          // prepare next/previous links so user can navigate through search results without having to go back to map/list view
          if (index > 0) {
            ctrl.prevId = ctrl.filteredLocations[index-1]._id;
          }
          if (index < (ctrl.filteredLocations.length-1) ) {
            ctrl.nextId = ctrl.filteredLocations[index+1]._id;
          }
        }
      }
    ]
  });
