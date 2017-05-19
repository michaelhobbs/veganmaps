define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');

  function locationEditController($routeParams, $http, $log, $scope, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.oriLocation = (ctrl.LocationService.currentLocation && Object.keys(ctrl.LocationService.currentLocation).length) ? ctrl.LocationService.currentLocation : ctrl.locationDetails;
    ctrl.updatedLocation = angular.copy(ctrl.oriLocation);

    ctrl.showAutocomplete = false;
    ctrl.toggleAutocomplete = function() {
      ctrl.showAutocomplete = !ctrl.showAutocomplete;
    }

    ctrl.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      ctrl.updatedLocation = angular.copy(ctrl.oriLocation);
    };

    ctrl.update = function() {
      $log.debug('updating: ', ctrl.updatedLocation);
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
