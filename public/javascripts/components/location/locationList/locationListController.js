define(function(require) {

  'use strict';

  var moment = require('moment');
  var _ = require('_');

  function locationListController($scope, $timeout, $mdSidenav, LocationService) {
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

    ctrl.filterExpression = function(location) {
      return ctrl.LocationService.filterValidates(location);
    }

    ctrl.toggleList = function() {
        $mdSidenav('right').toggle();
        $timeout(function () {
          ctrl.LocationService.resizeMap();
        }, 400);
        ctrl.updateCircleRange(); // hack to make markers update
    }

    ctrl.updateCircleRange = function() {
      ctrl.LocationService.range = $scope.slider.value;
      ctrl.LocationService.updateCircleRange();
    };

/** MOVE THIS OPENTIMES LOGIC TO BE RUN ONLY ONCE WHEN WE GET THE RESULTS FROM THE SERVER **/
    ctrl.hasOpenTimes = function(openTimes) {
      return !_.isNil(openTimes) && _.flatten(_.map(openTimes, function(item) { return item.times;})).length > 0;
    }

    ctrl.isOpen = function(openTimes) {
      var swissTime = moment.utc().utcOffset(1);
      var dayOfWeek = swissTime.isoWeekday(); // 1 Monday, 7 Sunday
      var timeInMinutes = swissTime.hours()*60 + swissTime.minutes();

      return _.find(_.get(openTimes,dayOfWeek).times,
        function(item) {
          return item.end > timeInMinutes  && item.start < timeInMinutes;
        });
    }

    ctrl.isoToStringDay = function(day) {
      var map = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        7: 'Sun'
      }
      return map[day];
    }

    ctrl.getTimeString = function(timeInMinutes) {
      var timeMoment = moment().hours(_.floor(timeInMinutes/60)).minutes(timeInMinutes%60);
      return timeMoment.format('HH:mm');
    }

    ctrl.isToday = function(day) {
      var swissTime = moment.utc().utcOffset(1);
      var dayOfWeek = swissTime.isoWeekday(); // 1 Monday, 7 Sunday
      return dayOfWeek === _.toInteger(day);
    }
/** MOVE THIS OPENTIMES LOGIC TO BE RUN ONLY ONCE WHEN WE GET THE RESULTS FROM THE SERVER **/

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

    ctrl.menuOptions = [
      {
        icon: 'home',
        label: 'home',
        href: '#/'
      },
      {
        icon: 'info',
        label: 'about',
        href: '#/info'
      },
      {
        icon: 'forum',
        label: 'forum',
        href: '#/forum'
      }
    ];
  };

return ['$scope', '$timeout', '$mdSidenav', 'LocationService', locationListController];

});
