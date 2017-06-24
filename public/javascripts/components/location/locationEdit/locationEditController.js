define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');
  var moment = require('moment');

  function locationEditController($routeParams, $http, $log, $scope, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.oriLocation = (ctrl.LocationService.currentLocation && Object.keys(ctrl.LocationService.currentLocation).length) ? ctrl.LocationService.currentLocation : ctrl.locationDetails;
    ctrl.updatedLocation = angular.copy(ctrl.oriLocation);

    ctrl.showAutocomplete = false;
    ctrl.toggleAutocomplete = function() {
      ctrl.showAutocomplete = !ctrl.showAutocomplete;
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


    ctrl.isMobileDevice = function() {
            var check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
    };

    ctrl.useUserLocation = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          alert('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);
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
    };

    ctrl.update = function() {
      $log.debug('updating: ', ctrl.updatedLocation);
      ctrl.convertDatesToOpenTimes();
      $http.put('api/locations/' + $routeParams.locationId, ctrl.updatedLocation).then(function(response) {
        $log.debug('Update Success. Response: ', response);
        ctrl.showSuccess = true;
      }, function(response) {
        $log.debug('Update Error. Response: ', response);
        ctrl.showError = true;
      });
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
      searchControl.resultList.clear();
      $scope.$apply();
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

  return ['$routeParams', '$http', '$log', '$scope', 'LocationService', locationEditController];

});
