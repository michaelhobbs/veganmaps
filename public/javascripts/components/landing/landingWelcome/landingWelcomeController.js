define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');

  function landingWelcomeController($routeParams, $location, $scope, LocationService) {
        var ctrl = this;
        ctrl.LocationService = LocationService;

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
          var searchButton =  form.appendChild(document.createElement('input'));
          searchButton.value = "Search";
          searchButton.type = "submit";
          searchButton.className = "btn";
          searchButton.style ="    font-size: 3rem;    padding: 0.5rem 1rem;    font-family: 'Moon Light', 'Architext Regular', serif;    cursor:pointer;    background: transparent;    border-radius: 3px;    border: 2px solid #ccc;    width: auto;    margin: auto;    margin-top: 2rem;";
          var root = elem;

          var container = document.createElement('div', 'leaflet-control-geosearch bar');
          container.appendChild(form);
          root.appendChild(container);
          this.elements.container = container;

          return this.searchElement.elements.container;
        };
        searchControl.onSubmit = function(query) {
          provider.search(query).then(function(r) {
            ctrl.LocationService.lastSearch.coords = {latitude: r[0].y, longitude: r[0].x};
            $location.path( "/maps" );
            $scope.$apply();
          });
        };
        searchControl.onAdd(document.getElementById('autocompleter'));
        // end overwrite of searchcontrol functions

        angular.element(document.getElementById('locationSearchForm')).bind('submit', function(event) {
          event.preventDefault();
          var input = angular.element(document.getElementById('locationSearchForm')).find('input');
          provider
            .search({ query: input[0].value })
            .then(function(r) {
              ctrl.LocationService.lastSearch.coords = {latitude: r[0].y, longitude: r[0].x};
              $location.path( "/maps" );
              $scope.$apply(); // outside angular digest
            });
        });
  };

  return ['$routeParams', '$location', '$scope', 'LocationService', landingWelcomeController];

});
