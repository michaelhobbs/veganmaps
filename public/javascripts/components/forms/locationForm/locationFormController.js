define(function(require) {

  'use strict';

  var Lgeo = require('leafletgeosearch');
  var moment = require('moment');

  function landingInfoController($routeParams, $http, $log, $scope, $mdToast, $timeout, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.updatedLocation = angular.copy(ctrl.location);

    ctrl.showAutocomplete = false;
    ctrl.toggleAutocomplete = function() {
      ctrl.showAutocomplete = !ctrl.showAutocomplete;
    }

    ctrl.flagMap = {
            gf: "Gluten-free",
            bio: "Organic",
            raw: "Raw",
            fullv: "100% vegan",
            //vOpt: false,
            //vOnReq: false,
            local: "Local produce",
            meat: "Meat"
          }

    new moment();
    ctrl.days = [1,2,3,4,5,6,7];
    ctrl.dayMap = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      7: 'Sun'
    };

    //military_time = Math.floor(time/60) + ':' + time%60 //var t = moment("1234", "hmm").toDate()

    $scope['timepicker'] = {mytime: new Date()};
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = false;
    $scope.changed = function () {
      $log.log('Time changed to: ' + $scope.timepicker.mytime);
    };

    // TIME PICKERS REQUIRE MODEL TO BE DATE OBJECTS
    ctrl.dateInputTimes = _.cloneDeep(ctrl.updatedLocation.openTimes);
    // convert times in minutes from midnight to JS Date Objects
    _.forEach(ctrl.dateInputTimes, function(dayTimes) {
      _.forEach(dayTimes.times, function(timeSlot) {
        timeSlot.start = moment().hours(_.floor(timeSlot.start/60)).minutes(timeSlot.start%60).seconds(0).milliseconds(0).toDate();
        timeSlot.end = moment().hours(_.floor(timeSlot.end/60)).minutes(timeSlot.end%60).seconds(0).milliseconds(0).toDate();
      })
    });

    ctrl.onTimeChange = function(day, slot) {
      // port the new value over to ctrl.updatedLocation.openTimes[day].times
      // or not, because user may have only changed one of the two start/end
      // instead, just do validation here?
      var startMoment = moment(slot.start);
      var endMoment = moment(slot.end);
      var invalidSlots = _.filter(ctrl.dateInputTimes[day].times, function(timeSlot) {
        return moment(timeSlot.start).isBefore(endMoment) && moment(timeSlot.end).isAfter(timeSlot.start);
      });
      $log.debug('After user update, there are : ' + _.size(invalidSlots) + ' invalid slots for day : ' + day);

      // TODO: also check that all the slots start before the end
    };

    ctrl.addTimeSlotForDay = function(day) {
      var newSlot = {
        start: moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate(),
        end: moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
      }
      ctrl.dateInputTimes[day].times.push(newSlot);
    }

    ctrl.removeTimeSlot = function(day, index) {
      _.pullAt(ctrl.dateInputTimes[day].times, index);
    }

    ctrl.convertDatesToOpenTimes = function() {
      _.forEach(ctrl.dateInputTimes, function(dayTimes, day) {
        if (ctrl.updatedLocation.openTimes[day].closed) {
          ctrl.updatedLocation.openTimes[day].times = [];
        }
        else {
          ctrl.updatedLocation.openTimes[day].times = _.map(dayTimes.times, function(timeSlot) {
            return {
              start: moment(timeSlot.start).hours() * 60 + moment(timeSlot.start).minutes(),
              end: moment(timeSlot.end).hours() * 60 + moment(timeSlot.end).minutes()
            };
          });
        }
      });
    }

    ctrl.copyTimeSlotToDay = function(slot,day) {
      ctrl.dateInputTimes[day].times.push({
        start: slot.start,
        end: slot.end
      });
    }

    ctrl.useUserLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $log.debug('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);
          //alert('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);

          if (position.coords.latitude >= 45.8 && position.coords.latitude <= 48 && position.coords.longitude >= 5.9 && position.coords.longitude <= 10.5 ) {
            $http.get('https://nominatim.openstreetmap.org/reverse', {
              params: {
                format: 'json',
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                addressdetails: 1
              }
            }).then(function(response) {
              $log.debug('Response: ', response);
              ctrl.updateFormFromSearch({raw:response.data});
            }, function(response) {
              $log.debug('Response: ', response);
              alert("failed to find your address");
            });
          }
          else {
            ctrl.LocationService.userInSwitzerland = false;
            ctrl.LocationService.map.removeControl(ctrl.userPositionControl);
            alert("you need to be in Switzerland in order to use this feature");
          }

        },
        function (error) {
          if (error.code == error.PERMISSION_DENIED)
              alert("you need to allow the use of your location in order to use this feature");
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

    ctrl.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      ctrl.updatedLocation = angular.copy(ctrl.oriLocation);
      ctrl.dateInputTimes = _.cloneDeep(ctrl.updatedLocation.openTimes);
      _.forEach(ctrl.dateInputTimes, function(dayTimes) {
        _.forEach(dayTimes.times, function(timeSlot) {
          timeSlot.start = moment().hours(_.floor(timeSlot.start/60)).minutes(timeSlot.start%60).seconds(0).milliseconds(0).toDate();
          timeSlot.end = moment().hours(_.floor(timeSlot.end/60)).minutes(timeSlot.end%60).seconds(0).milliseconds(0).toDate();
        })
      });
    };

    function showSuccessToast() {
      var toast = $mdToast.simple()
        .textContent('Save successful!')
        .action('ok')
        .highlightAction(true)
        .position('bottom right')
        .hideDelay(2000)
        .toastClass('success-toast');

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          //alert('You clicked the \'UNDO\' action.');
        }
      });
    };

    function showErrorToast() {
      var toast = $mdToast.simple()
        .textContent('Save failed!')
        .action('ok')
        .highlightAction(true)
        .position('bottom right')
        .hideDelay(2000)
        .toastClass('error-toast');

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          //alert('You clicked the \'UNDO\' action.');
        }
      });
    }

    ctrl.update = function(valid) {
      if (valid) {
        ctrl.convertDatesToOpenTimes();

        if ($routeParams.locationId) {
          $log.debug('updating a location: ', ctrl.updatedLocation);
          $http.put('api/locations/' + $routeParams.locationId, ctrl.updatedLocation).then(function(response) {
            $log.debug('Update Success. Response: ', response);
            showSuccessToast();
          }, function(response) {
            $log.debug('Update Error. Response: ', response);
            showErrorToast();
          });
        }
        else {
          $log.debug('saving a new location: ', ctrl.updatedLocation);
          $http.put('api/locations', ctrl.updatedLocation).then(function(response) {
            $log.debug('Response: ', response);
            showSuccessToast();
          }, function(response) {
            $log.debug('Response: ', response);
            showErrorToast();
          });
        }
      }
      else {
        var toast = $mdToast.simple()
          .textContent('Form has errors!')
          .action('ok')
          .highlightAction(true)
          .position('bottom right')
          .hideDelay(2000)
          .toastClass('error-toast');

        $mdToast.show(toast).then(function(response) {
          if ( response == 'ok' ) {
            //alert('You clicked the \'UNDO\' action.');
          }
        });
      }
    }

    ctrl.updateFormFromSearch = function(r) {
      // update location with selected address
      ctrl.updatedLocation.address = ctrl.updatedLocation.address ? ctrl.updatedLocation.address : {};
      ctrl.updatedLocation.address.number = r.raw.address.house_number;
      ctrl.updatedLocation.address.street = r.raw.address.road || r.raw.address.footway || r.raw.address.pedestrian;
      ctrl.updatedLocation.address.postcode = r.raw.address.postcode;
      ctrl.updatedLocation.address.city = r.raw.address.city || r.raw.address.village || r.raw.address.town;
      ctrl.updatedLocation.address.state = r.raw.address.state;
      ctrl.updatedLocation.address.country = r.raw.address.country;

      ctrl.updatedLocation.name = r.raw.address.restaurant || ctrl.updatedLocation.name;

      ctrl.updatedLocation.longitude = Number(r.raw.lon);
      ctrl.updatedLocation.latitude = Number(r.raw.lat);
      // remove autocomplete suggestions, close dropdown menu
      $timeout(function() {
        searchControl.resultList.clear();
      });
    }


    /** AUTOCOMPLETE GEOSEARCH */
    var provider = new Lgeo.OpenStreetMapProvider({
      params:{
        countrycodes: 'CH',
        addressdetails:1,
        limit: 10
      }
    });
    var searchControl = new Lgeo.GeoSearchControl({
        provider: provider,
        autoCompleteDelay: 1000,
        searchLabel: ''
      });

    /* Overwriting search control so that it works even without a map */
    searchControl.onAdd = function(elem) {
      var classes = this.searchElement.elements.input.className;
      this.searchElement.elements.input.className += ' input__field--makiko input__field';
      this.searchElement.elements.input.setAttribute('id', 'input-16');
      this.searchElement.elements.input.setAttribute('autocomplete', 'off');
      this.searchElement.elements.input.setAttribute('required', ''); // hack to let CSS :valid mean that there is content in the input
      var form  = this.searchElement.elements.form;
      form.id = "locationSearchForm"; // needed for event listener so that search button works

      var fancyFocusEffectContainer = document.createElement('span');
      fancyFocusEffectContainer.className = "input input--makiko";

      form.insertBefore(fancyFocusEffectContainer, this.searchElement.elements.input);
      fancyFocusEffectContainer.appendChild(this.searchElement.elements.input);

      var fancyFocusEffectLabel = document.createElement('label');
      fancyFocusEffectLabel.className = "input__label input__label--makiko";
      fancyFocusEffectLabel.setAttribute('for', 'input-16');

      var fancyFocusEffectPlaceholder = document.createElement('span');
      fancyFocusEffectPlaceholder.className = "input__label-content input__label-content--makiko";
      fancyFocusEffectPlaceholder.innerHTML = 'Search';

      fancyFocusEffectLabel.appendChild(fancyFocusEffectPlaceholder);
      fancyFocusEffectContainer.appendChild(fancyFocusEffectLabel);


      var root = elem;

      var container = document.createElement('div', 'leaflet-control-geosearch bar');
      container.appendChild(form);
      root.appendChild(container);
      this.elements.container = container;

      return this.searchElement.elements.container;
    };
    searchControl.onSubmit = function(query) {
      provider.search(query).then(function(r) {
        $log.debug('User selected autocomplete suggestion through LISTENER: ', r);
        // update location with selected address
        ctrl.updateFormFromSearch(r[0]);
      });
    };
    // Use custom formatting of address for display in autocomplete suggestions
    searchControl.resultList.renderOld = searchControl.resultList.render;
    searchControl.resultList.render = function(results) {
      console.log("RESULTS: ", results);
      results.forEach(function(result) {
        var label = '';
        if (result.raw.address.restaurant) {
          label += result.raw.address.restaurant +', ';
        }
        if (result.raw.address.house_number) {
          label += result.raw.address.house_number +', ';
        }
        if (result.raw.address.road) {
          label += result.raw.address.road +', ';
        }
        if (result.raw.address.footway) {
          label += result.raw.address.footway +', ';
        }
        if (result.raw.address.pedestrian) {
          label += result.raw.address.pedestrian +', ';
        }
        if (result.raw.address.village) {
          label += result.raw.address.village +', ';
        }
        if (result.raw.address.town) {
          label += result.raw.address.town +', ';
        }
        if (result.raw.address.city) {
          label += result.raw.address.city +', ';
        }
        if (result.raw.address.postcode) {
          label += result.raw.address.postcode;
        }
        label = label.trim();
        if (label.endsWith(',')) {
          label = label.substr(0,label.length -1);
        }
        if (label !== '') {
          result.label = label;
        }
      });
      searchControl.resultList.renderOld(results);
    };
    searchControl.onAdd(document.getElementById('autocompleter'));

    // by default leaflet-geosearch makes a new query to provider with the label the user selected. This is not guaranteed to return a result... Here we overwrite this function making it use the result's coordinates directly.
    searchControl.resultList.props.handleClick = function(event) {
      ctrl.updateFormFromSearch(event.result);
      searchControl.searchElement.elements.input.value = event.result.label;
    };
    // end overwrite of searchcontrol functions


    /** END AUTOCOMPLETE GEOSEARCH */
  };

  return ['$routeParams', '$http', '$log', '$scope', '$mdToast', '$timeout', 'LocationService', landingInfoController];

});
