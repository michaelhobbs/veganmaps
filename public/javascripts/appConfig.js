angular.
  module('veganmaps').
  config(['$routeProvider',
    function config($routeProvider) {

      $routeProvider.
        when('/', {
          template: '<location-list></location-list>'
        }).
        when('/id/:locationId', {
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
        when('/new', {
          template: '<location-add></location-add>'
        }).
        when('/edit/:locationId', {
          template: '<location-edit>hi</location-edit>'
        }).
        otherwise('/');
    }
  ]);
