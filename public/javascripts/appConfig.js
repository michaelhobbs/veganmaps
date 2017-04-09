define(function(require) {

  'use strict';

  function config($routeProvider) {
    $routeProvider.
      when('/', {
        template: '<landing-welcome></landing-welcome>'
      }).
      when('/maps', {
        template: '<location-list></location-list>'
      }).
      when('/maps/id/:locationId', {
        template: '<location-detail location-details="$resolve.locationDetails.data"></location-detail>',
        resolve: {
          locationDetails: function($http, $route, LocationService) {
            if (!LocationService.lastSearch.results) {
              return $http.get('api/locations/' + $route.current.params.locationId);
            }
            else {
              return {};
            }
          }
        }
      }).
      when('/maps/new', {
        template: '<location-add></location-add>'
      }).
      when('/maps/edit/:locationId', {
        template: '<location-edit location-details="$resolve.locationDetails.data"></location-edit>',
        resolve: {
          locationDetails: function($http, $route, LocationService) {
            if (!LocationService.lastSearch.results) {
              return $http.get('api/locations/' + $route.current.params.locationId);
            }
            else {
              return {};
            }
          }
        }
      }).
      when('/info', {
        template: '<landing-info></landing-info>'
      }).
      otherwise('/');
  };

  return ['$routeProvider', config];
});
