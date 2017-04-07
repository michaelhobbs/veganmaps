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
        // var searchControl = new Lgeo.GeoSearchControl({
        //     provider: provider,
        //     style: 'bar',
        //     autoCompleteDelay: 1000,
        //     showMarker: false
        //   });

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
