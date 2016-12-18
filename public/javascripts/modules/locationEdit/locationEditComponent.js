angular.
  module('locationEdit').
  component('locationEdit', {
    templateUrl: '/javascripts/modules/locationEdit/locationEditTemplate.html',
    controller: ['$routeParams', '$http', '$log', 'LocationService',
      function locationAddController($routeParams, $http, $log, LocationService) {
        var ctrl = this;
        ctrl.LocationService = LocationService;
        ctrl.oriLocation = ctrl.LocationService.currentLocation;
        ctrl.updatedLocation = angular.copy(ctrl.oriLocation);

        ctrl.reset = function(form) {
          if (form) {
            form.$setPristine();
            form.$setUntouched();
          }
          ctrl.updatedLocation = angular.copy(ctrl.oriLocation);
        };

        ctrl.update = function() {
          // TODO make save call to BE
          $log.debug('updating: ', ctrl.updatedLocation);
          $http.put('api/locations/' + $routeParams.locationId, ctrl.updatedLocation).then(function(response) {
            $log.debug('Update Success. Response: ', response);
          }, function(response) {
            $log.debug('Update Error. Response: ', response);
          });
        }
      }
    ]
  });
