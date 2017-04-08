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
            style: 'bar',
            autoCompleteDelay: 1000,
            searchLabel: 'swiss street, city'
          });

        /* Overwriting search control so that it works even without a map */
        searchControl.onAdd = function(elem) {
          /*
          var form  = this.searchElement.elements.form;
          var root = elem;

          root.appendChild(form);
          this.elements.container = root;

          return this.searchElement.elements.container;*/
          var form  = this.searchElement.elements.form;
          var searchButton =  form.appendChild(document.createElement('input')); // after inpout -> ', "class1 clas2 etc"'
          searchButton.value = "Search";
          searchButton.type = "submit";
          searchButton.className = "btn";
          searchButton.style ="    font-size: 3rem;    padding: 0.5rem 1rem;    font-family: 'Moon Light', 'Architext Regular', serif;    cursor:pointer;    background: transparent;    border-radius: 3px;    border: 2px solid #ccc;    width: auto;    margin: auto;    margin-top: 2rem;";
          var root = elem;

          var container = document.createElement('div', 'leaflet-control-geosearch bar');
          container.appendChild(form);
          root.appendChild(container);
          this.elements.container = container;
        /*  <input style="
  line-height: 4rem;
  height: 4rem;
  width: 70%;
  font-size: 2rem;
  font-family: 'Moon Light', 'Architext Regular', serif;
  border: 2px solid black;
  border-radius:3px;
  max-width: 700px;
  margin: auto;
  margin-top: 2rem;" placeholder="swiss street, city"> */

          return this.searchElement.elements.container;
        };
        searchControl.onSubmit = function(query) {
          provider.search(query).then(function(r) {ctrl.LocationService.lastSearch.coords = {latitude: r[0].y, longitude: r[0].x};
          $location.path( "/maps" );
          $scope.$apply();});
        };
        searchControl.onAdd(document.getElementById('autocompleter'));
                // overwrite searchControl.onAdd() to add it to my form

                /*  onAdd(map) {
                      const { showMarker, style } = this.options;

                      this.map = map;
                      if (showMarker) {
                        this.markers.addTo(map);
                      }

                      if (style === 'bar') {
                        const { form } = this.searchElement.elements;
                        const root = map.getContainer().querySelector('.leaflet-control-container');

                        const container = createElement('div', 'leaflet-control-geosearch bar');
                        container.appendChild(form);
                        root.appendChild(container);
                        this.elements.container = container;
                      }

                      return this.searchElement.elements.container;
                    }*/

                // overwrite searchControl.onSubmit() to load map page with param long/lat
                /*  async onSubmit(query) {
                      const { provider } = this.options;

                      const results = await provider.search(query);

                      if (results && results.length > 0) {
                        this.showResult(results[0]);
                      }
                    },*/


        angular.element(document.getElementById('locationSearchForm')).bind('submit', async (event) => {
          event.preventDefault();
          var input = angular.element(document.getElementById('locationSearchForm')).find('input');
          provider
            .search({ query: input[0].value })
            .then(function(r) {
              // do something with result;
              console.log(r); // » [{}, {}, {}, ...]

              ctrl.LocationService.lastSearch.coords = {latitude: r[0].y, longitude: r[0].x};
              $location.path( "/maps" );
              $scope.$apply(); // outside angular digest
            });
        });
  };

  return ['$routeParams', '$location', '$scope', 'LocationService', landingWelcomeController];

});
