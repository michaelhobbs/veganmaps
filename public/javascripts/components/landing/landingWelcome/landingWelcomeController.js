define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');
  var removeDiacritics = require('removeDiacritics');

  function landingWelcomeController($routeParams, $location, $scope, LocationService) {
        var ctrl = this;
        ctrl.LocationService = LocationService;

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
            searchLabel: 'Enter Swiss street, city...'
          });

        /* Overwriting search control so that it works even without a map */
        searchControl.onAdd = function(elem) {
          var _isNotMobile = (function() {
                  var check = false;
                  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
                  return !check;
              })();
          if (_isNotMobile) {
            this.searchElement.elements.input.setAttribute('autofocus', 'true');
          }
          var form  = this.searchElement.elements.form;
          form.id = "locationSearchForm"; // needed for event listener so that search button works
          var fancyFocusEffectContainer = document.createElement('div');
          fancyFocusEffectContainer.className = "fancyFocusEffectContainer";
          form.insertBefore(fancyFocusEffectContainer, this.searchElement.elements.input);
          fancyFocusEffectContainer.appendChild(this.searchElement.elements.input);

          var fancyFocusEffect =  fancyFocusEffectContainer.appendChild(document.createElement('span'));
          fancyFocusEffect.className = "focus-border";
          fancyFocusEffect.appendChild(document.createElement('i'));
          var searchButton =  form.appendChild(document.createElement('input'));
          searchButton.value = "Search";
          searchButton.type = "submit";
          searchButton.className = "btn btn--search";
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
              result.label = label;//removeDiacritics(label);
            }
          });
          searchControl.resultList.renderOld(results);
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

        // by default leaflet-geosearch makes a new query to provider with the label the user selected. This is not guaranteed to return a result... Here we overwrite this function making it use the result's coordinates directly.
        searchControl.resultList.props.handleClick = function(event) {
          ctrl.LocationService.lastSearch.coords = {latitude: event.result.y, longitude: event.result.x};
          $location.path( "/maps" );
          $scope.$apply(); // outside angular digest
        };
  };

return ['$routeParams', '$location', '$scope', 'LocationService', landingWelcomeController];

});
