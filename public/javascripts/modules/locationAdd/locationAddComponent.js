angular.
  module('locationAdd').
  component('locationAdd', {
    templateUrl: '/javascripts/modules/locationAdd/locationAddTemplate.html',
    controller: ['$http', '$log', 'LocationService',
      function locationAddController($http, $log, LocationService) {
        var ctrl = this;
        ctrl.LocationService = LocationService;
        ctrl.oriLocation = {name:'', longitude: '', latitude:''};
        ctrl.newLocation = angular.copy(ctrl.oriLocation);

        ctrl.reset = function(form) {
          if (form) {
            form.$setPristine();
            form.$setUntouched();
            form.$rollbackViewValue();
          }
          ctrl.newLocation = angular.copy(ctrl.oriLocation);
        };

        ctrl.update = function() {
          // TODO make save call to BE
          $log.debug('saving: ', ctrl.newLocation);
        }
      }
    ]
  });
