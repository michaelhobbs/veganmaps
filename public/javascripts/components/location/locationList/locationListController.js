define(function(require) {

  'use strict';

  function locationListController($scope, $timeout, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.LocationService.range = 2000;
    ctrl.defaultMapPosition =  {coords: {latitude: 47.3841831, longitude: 8.5329786}};

    ctrl.LocationService.getGeoLocation = function() {
        ctrl.LocationService.lastSearch.coords = ctrl.LocationService.lastSearch.coords ? ctrl.LocationService.lastSearch.coords : ctrl.defaultMapPosition.coords;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                        ctrl.LocationService.initializeMap(position);
                        //      map.setCenter(initialLocation);
                      }, function(error) {
                              console.log(error);
                              console.debug('Unable to get user location. Using fallback.', ctrl.defaultMapPosition);
                              ctrl.LocationService.initializeMap(ctrl.defaultMapPosition);
                      });
        }
    };

    ctrl.toggleOptions = function() {
      $timeout(function () {
              $scope.$broadcast('rzSliderForceRender');
      });
      $scope.showOptions = !$scope.showOptions;
    }

    ctrl.filterExpression = function(location) { // TODO: apply filter to map also
      var typeFilterValidates = (ctrl.LocationService.lastSearch.filterProp === 'all' || location.flags[ctrl.LocationService.lastSearch.filterProp] === true);
      var distanceFilterValidates = $scope.slider.value >= location.distance;
      return typeFilterValidates && distanceFilterValidates;
    }

    ctrl.toggleList = function() {
        ctrl.LocationService.listView = !ctrl.LocationService.listView;
        ctrl.LocationService.resizeMap();

    }

    ctrl.updateCircleRange = function() {
      ctrl.LocationService.range = $scope.slider.value;
      ctrl.LocationService.updateCircleRange();
    };

    $scope.slider = {
      value: ctrl.LocationService.range,
      options: {
        onEnd: ctrl.updateCircleRange,
        hideLimitLabels: true,
        hidePointerLabels: true,
        showTicks: true,
        stepsArray: [
          {value: 500, legend: '500m'},
          {value: 1000, legend: '1km'},
          {value: 2000, legend: '2km'},
          {value: 5000, legend: '5km'},
          {value: 10000, legend: '10km'}
        ]
      }
    };
  };

  return ['$scope', '$timeout', 'LocationService', locationListController];

});
