define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');

  function locationAddController($http, $log, $scope, LocationService) {
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.oriLocation = {
      name:'',
      longitude: '',
      latitude:'',
      flags: {
        gf: false,
        bio: false,
        raw: false,
        fullv: false,
        //vOpt: false,
        //vOnReq: false,
        local: false,
        meat: false
      }
    };
    ctrl.updatedLocation = angular.copy(ctrl.oriLocation);

    ctrl.reset = function(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
        form.$rollbackViewValue();
      }
      ctrl.updatedLocation = angular.copy(ctrl.oriLocation);
    };

    ctrl.update = function() {
      $log.debug('saving: ', ctrl.updatedLocation);
      $http.put('api/locations', ctrl.updatedLocation).then(function(response) {
        $log.debug('Response: ', response);
        ctrl.showSuccess = true;
      }, function(response) {
        $log.debug('Response: ', response);
        ctrl.showError = true;
      });
    };

    /** AUTOCOMPLETE GEOSEARCH */
    var provider = new Lgeo.OpenStreetMapProvider({
      params:{
        countrycodes: 'CH',
        addressdetails:1,
        limit: 3
      }
    });
    var searchControl = new Lgeo.GeoSearchControl({
        provider: provider,
        autoCompleteDelay: 1000,
        searchLabel: 'swiss street, city'
      });

    /* Overwriting search control so that it works even without a map */
    searchControl.onAdd = function(elem) {
      this.searchElement.elements.input.setAttribute('autofocus', 'true');
      var form  = this.searchElement.elements.form;
      form.id = "locationSearchForm"; // needed for event listener so that search button works
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
        ctrl.updatedLocation.address = ctrl.updatedLocation.address ? ctrl.updatedLocation.address : {};
        ctrl.updatedLocation.address.number = r[0].raw.address.house_number;
        ctrl.updatedLocation.address.street = r[0].raw.address.road;
        ctrl.updatedLocation.address.postcode = r[0].raw.address.postcode;
        ctrl.updatedLocation.address.city = r[0].raw.address.city;
        ctrl.updatedLocation.address.state = r[0].raw.address.state;
        ctrl.updatedLocation.address.country = r[0].raw.address.country;

        ctrl.updatedLocation.longitude = Number(r[0].raw.lon);
        ctrl.updatedLocation.latitude = Number(r[0].raw.lat);
        // remove autocomplete suggestions, close dropdown menu
        searchControl.resultList.clear();
        $scope.$apply();
      });
    };
    searchControl.onAdd(document.getElementById('autocompleter'));
  // end overwrite of searchcontrol functions

  /** enable if add a button to "translate" user input into an address ... does this makes sense? It basically takes the first autocomplete suggestion... Maybe from UX perspective it is needed though?
  **
  angular.element(document.getElementById('locationSearchForm')).bind('submit', async (event) => {
    event.preventDefault();
    var input = angular.element(document.getElementById('locationSearchForm')).find('input');
    provider
      .search({ query: input[0].value })
      .then(function(r) {
        $log.debug('User selected autocomplete suggestion through EVENT: ', r);
        // Send result raw address data to rest of address form
        //$scope.$apply(); // outside angular digest
      });
  });
  */

  };
  /** END AUTOCOMPLETE GEOSEARCH */
  return ['$http', '$log', '$scope', 'LocationService', locationAddController];

});
