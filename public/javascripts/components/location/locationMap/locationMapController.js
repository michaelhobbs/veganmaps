define(function(require) {

  'use strict';
  //var io = require('socketio');
  var L = require('leaflet');
  var Lgeo = require('leafletgeosearch');

  function locationMapController($scope, $timeout, $http, $log, LocationService) {

    var MAP_TYPE = 'leaflet'; // 'leaflet' || 'google'
    var ctrl = this;
    ctrl.LocationService = LocationService;
    ctrl.LocationService.mapType = MAP_TYPE;
    //var socket = io.connect('http://localhost:3000'); // socket handler has to be at end of file such that it registers callbacks which have been initialized

    ctrl.LocationService.map;
    ctrl.LocationService.markers = [];
    // ctrl.locationMarkerIcon = L.icon({
    //           iconUrl: '/images/locationMarker.png',
    //           iconSize: [40, 40],
    //           iconAnchor: [20, 30]
    //         });
    ctrl.maxZoom = ctrl.LocationService.isMobileDevice() ? 15 : 17;
    ctrl.minZoom = ctrl.LocationService.isMobileDevice() ? 11 : 12;

    if (MAP_TYPE === 'leaflet') {
      ctrl.LocationService.lastSearch = ctrl.LocationService.lastSearch ? ctrl.LocationService.lastSearch : {};
      ctrl.LocationService.lastSearch.coords = ctrl.LocationService.lastSearch.coords ? ctrl.LocationService.lastSearch.coords : {latitude: 47.3841831, longitude: 8.5329786};

      ctrl.LocationService.updateCircleRange = function() { // called when range slider value changes
        ctrl.rangeCirclemarker.setRadius(ctrl.LocationService.range);
        //for marker in markers, if marker.distance > range -> set marker opacity to low
        ctrl.LocationService.lastSearch.results.forEach(function(place){
          if (!ctrl.LocationService.filterValidates(place)) {
            // find corresponding marker and change its opacity and z-index
            var t = _.find(ctrl.LocationService.markers,function (m) { return m.id === place._id;});
            if (t) {
              //ctrl.LocationService.map.removeLayer(marker.marker);
              t.marker.setOpacity(0.5);
              t.marker.getElement().style.filter = "grayscale(100%)";
            }
          }
          else {
            var t = _.find(ctrl.LocationService.markers,function (m) { return m.id === place._id;});
            if (t) {
              //ctrl.LocationService.map.removeLayer(marker.marker);
              t.marker.setOpacity(1);
              t.marker.getElement().style.filter = "none";
            }
          }

        });
      }

      ctrl.loadPlaces = function(places) { // called when server sends list of places for a new search
        console.log('Loading places.', places);
        if (places) {
          places.forEach (function(place) {
            place.distance = ctrl.LocationService.distance(place.latitude, place.longitude, ctrl.LocationService.lastSearch.coords.latitude, ctrl.LocationService.lastSearch.coords.longitude);
          });
        }

        ctrl.LocationService.lastSearch.results = places;
        //$scope.$apply();
        // Clear out the old markers.
        ctrl.LocationService.markers.forEach(function(marker) {
          ctrl.LocationService.map.removeLayer(marker.marker);
        });
        ctrl.LocationService.markers = [];
        var flagsHTML = '';
        if (places) {
          places.forEach (function(place) {
            flagsHTML = ''
            console.log('Found close place: ', place);
            Object.keys(place.flags).forEach(function(key) {
              if (place.flags[key]) {
                flagsHTML += '<div class="locationFlagIcon ' +key + '"></div>';
              }
            });
            ctrl.LocationService.markers.push({id:place._id, marker: L.marker(place.location.coordinates.reverse()//,{icon:ctrl.locationMarkerIcon}
              ).addTo(ctrl.LocationService.map).bindPopup('<a href="#/maps/id/'+place._id+'" class="location-name">'+place.name+'</a><br><a href="https://www.google.com/maps/dir/' + ctrl.LocationService.lastSearch.coords.latitude+','+ctrl.LocationService.lastSearch.coords.longitude+'/'+place.location.coordinates[0]+','+place.location.coordinates[1]+'" target="_blank">directions</a>'+'<div>'+flagsHTML+'<div>')});
            var t = ctrl.LocationService.markers.find(function (m) { return m.id === place._id;});
            if (!ctrl.LocationService.filterValidates(place)) {
              if (t) {
                //ctrl.LocationService.map.removeLayer(marker.marker);
                t.marker.setOpacity(0.5);
                t.marker.getElement().style.filter = "grayscale(100%)";
              }
            }
          });
        }
      }

      ctrl.LocationService.resizeMap = function() { // called when toggle list open/closed
        setTimeout(function(){
          ctrl.LocationService.map.invalidateSize(true)
        }, 100);
      }

      ctrl.LocationService.initializeMap = function(position) { // called when initial search is made, either with geolocation coords, or default. this function needs to initialize the map
        /******START CUSTOM CONTROLS ******/
        var customControl =  L.Control.extend({
          options: {
            position: 'bottomright'
          },

          onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom fa fa-bullseye');

            container.style.backgroundColor = 'white';
            container.style.fontSize = '2rem';
            container.style.padding = '0.5rem';

            container.onclick = function(){
              console.log('buttonClicked');
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                  $log.debug('coords: ' + position.coords.latitude + ', ' + position.coords.longitude);

                  if (position.coords.latitude >= 45.8 && position.coords.latitude <= 48 && position.coords.longitude >= 5.9 && position.coords.longitude <= 10.5 ) {
                    ctrl.moveMapTo(position.coords.latitude, position.coords.longitude);
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

            return container;
          }
        });
        /******END CUSTOM CONTROLS*******/
        position = [ctrl.LocationService.lastSearch.coords.latitude,ctrl.LocationService.lastSearch.coords.longitude];
        ctrl.LocationService.map = L.map('map-canvas', {maxBounds: [[45.8,5.9],[48.0,10.5]] //[[[5.9559111595,45.8179931641],[10.4920501709,45.8179931641],[10.4920501709,47.808380127],[5.9559111595,47.808380127],[5.9559111595,45.8179931641]]]
        }).setView(position, 13);
        L.tileLayer('https://tile.osm.ch/osm-swiss-style/{z}/{x}/{y}.png', {//https://opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'data &copy <a href="http://openstreetmap.org/copyright">OSM</a> map <a href="https://creativecommons.org/licenses/by/4.0/">cc-by</a> <a href="https://github.com/xyztobixyz/OSM-Swiss-Style">xyztobixyz</a>',
            maxZoom: ctrl.maxZoom, // iphone has trouble panning map if zoom too far, mobile-> 15 , pc -> 17
            minZoom: ctrl.minZoom
        }).addTo(ctrl.LocationService.map);
        // var icontext = 'A';
        var userMarkerIcon =
        //         L.icon({
        //           iconUrl: '/images/marker.png',
        //           iconSize: [16, 16],
        //           iconAnchor: [8, 8]
        //         });
          L.divIcon({
               className: 'map-marker user-position',
               iconSize:null,
               html:'<div class="icon"></div>'//'<div class="icon">'+icontext+'</div>'
             });

        ctrl.userMarker = L.marker(position, {icon: userMarkerIcon, zIndexOffset: -1000}).addTo(ctrl.LocationService.map)
        ctrl.rangeCirclemarker = L.circle(position, {
            color: 'white',
            fillColor: '#000',
            fillOpacity: 0.03,
            radius: 2000 // meters
        }).addTo(ctrl.LocationService.map);

        ctrl.maxRangeCirclemarker = L.circle(position, {
            color: 'white',
            opacity: 0.6,
            dashArray: "30 10",
            fill: false,
            radius: 10000 // meters
        }).addTo(ctrl.LocationService.map);

        L.control.scale().addTo(ctrl.LocationService.map);

        // add control for moving map to user location
        if (ctrl.LocationService.isMobileDevice() && ctrl.LocationService.userInSwitzerland) {
          ctrl.userPositionControl = new customControl();
          ctrl.LocationService.map.addControl(ctrl.userPositionControl);
        }
        // autocomplete search controls
        var mapBounds = ctrl.LocationService.map.getBounds();
        var viewbox = mapBounds.getWest() + ',' + mapBounds.getNorth() + ',' + mapBounds.getEast() +',' + (mapBounds.getSouth()+0.1);
        var provider = new Lgeo.OpenStreetMapProvider({params:{
          countrycodes: 'CH', addressdetails:1, limit: 10, viewbox: viewbox}}
        );
        var searchControl = new Lgeo.GeoSearchControl({
          provider: provider,
          style: 'bar',
          autoCompleteDelay: 1000,
          showMarker: false
        });

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
          // TODO: remove duplicates, if street name is same and town/city and postcode
          searchControl.resultList.renderOld(results);
        };

        // allow autocomplete to be focussed on iOS safari
        searchControl.searchElement.elements.input.addEventListener("click", function(){this.focus();});


        // by default leaflet-geosearch makes a new query to provider with the label the user selected. This is not guaranteed to return a result... Here we overwrite this function making it use the result's coordinates directly.
        searchControl.resultList.props.handleClick = function(event) {
              ctrl.LocationService.map.fireEvent('geosearch/showlocation', {
                location: event.result
              });
              searchControl.centerMap(event.result);
          };


        ctrl.LocationService.map.addControl(searchControl);
        L.DomEvent.disableClickPropagation(searchControl.searchElement.elements.input); // allow text selection in input without panning map

        // auto close result list (aka. autocomplete options) after user selects one
        ctrl.LocationService.map.on("geosearch/showlocation", function(r) {
          searchControl.resultList.clear();
          ctrl.moveMapTo(r.location.y, r.location.x);
        });

        console.debug('sending query position: (lat, lng) ', ctrl.LocationService.lastSearch.coords);
        $http.get('api/locations/search/' +   ctrl.LocationService.lastSearch.coords.latitude+','+ctrl.LocationService.lastSearch.coords.longitude).then(function(response) {
          ctrl.loadPlaces(response.data);
        });
        //socket.emit('position', ctrl.LocationService.lastSearch.coords);
      }
      // need to trigger ctrl.LocationService.getGeoLocation() in order to start loading the map

      ctrl.moveMapTo = function (lat, lng) {
        ctrl.userMarker.setLatLng({lat: lat, lng: lng});
        ctrl.rangeCirclemarker.setLatLng({lat: lat, lng: lng});
        ctrl.maxRangeCirclemarker.setLatLng({lat: lat, lng: lng});
        ctrl.LocationService.lastSearch.coords = {latitude: lat, longitude: lng};
        $http.get('api/locations/search/' +   ctrl.LocationService.lastSearch.coords.latitude+','+ctrl.LocationService.lastSearch.coords.longitude).then(function(response) {
          ctrl.loadPlaces(response.data);
        });
        ctrl.LocationService.map.panTo(new L.LatLng(lat, lng));
      }
      //ctrl.LocationService.getGeoLocation();
    }

    // above we defined all the functions the map uses.
    // now we have to initialize it.
    // in the initialize function it will create the map, so we have to wait for the DOM to be ready in order for the map to have correct size.
    // at the end of the initialize function a call is made to the backend to fetch the locations near the center of the map
    angular.element(document).ready(function () {
      $timeout(function () {
        ctrl.LocationService.initializeMap();
      }, 300);
    });



















    if (MAP_TYPE === 'google') {
      ctrl.LocationService.updateCircleRange = function() {
        if (ctrl.rangeCirclemarker) {
          ctrl.rangeCirclemarker.setMap(null);
        }
        ctrl.rangeCirclemarker = new google.maps.Circle({
          strokeColor: '#00FF00',
          strokeOpacity: 0.35,
          strokeWeight: 2,
          fillColor: '#FFFFFF',
          fillOpacity: 0.05,
          map: ctrl.LocationService.map,
          center: new google.maps.LatLng(ctrl.LocationService.lastSearch.coords.latitude, ctrl.LocationService.lastSearch.coords.longitude),
          radius: ctrl.LocationService.range
        });

      };

      ctrl.loadPlaces = function(places) {
        console.log('Loading places.', places);
        places.forEach (function(place) {
          place.distance = ctrl.LocationService.distance(place.latitude, place.longitude, ctrl.LocationService.lastSearch.coords.latitude, ctrl.LocationService.lastSearch.coords.longitude);
        });

        ctrl.LocationService.lastSearch.results = places;
        $scope.$apply();
        // Clear out the old markers.
        ctrl.LocationService.markers.forEach(function(marker) {
            marker.setMap(null);
        });
        ctrl.LocationService.markers = [];
        places.forEach (function(place) {
            console.log('Found close place: ', place);
            var latLng = new google.maps.LatLng(place.latitude, place.longitude);
            ctrl.LocationService.markers.push(new google.maps.Marker({
                position: latLng,
                map: ctrl.LocationService.map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }));
        });

        ctrl.LocationService.updateCircleRange();
      }


      ctrl.LocationService.resizeMap = function() {
        $timeout(function () {
          google.maps.event.trigger(ctrl.LocationService.map, "resize"); // should be called through interface
        },10);
      }


      ctrl.LocationService.initializeMap = function(position) {
          var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var initialPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          socket.emit('position', initialPosition);
          console.log('Sending server location:', initialPosition);

          var mapOptions = {
              zoom: 14,
              minZoom: 10,
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              center: initialLocation,
              styles: [
                 {"featureType":"all","elementType":"geometry","stylers":[{"saturation":"18"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#3577ad"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#661212"}]},{"featureType":"all","elementType":"labels","stylers":[{"color":"#682828"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#822626"},{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#37312c"},{"lightness":"0"},{"saturation":"-13"},{"weight":"2"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"off"},{"weight":"0.01"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#52463b"},{"weight":"4.89"},{"lightness":"11"},{"gamma":"1"},{"visibility":"off"},{"saturation":"0"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"color":"#c06969"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#252525"},{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#252525"},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":"18"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2},{"visibility":"on"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#2c2c28"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#252525"},{"lightness":18},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#863131"},{"lightness":16},{"visibility":"on"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#282a32"},{"lightness":"4"}]}]
           };
           ctrl.LocationService.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

          var markers = [new google.maps.Marker({
              position: initialLocation,
              map: ctrl.LocationService.map,
              draggable: false
          })];

          // Create the search box and link it to the UI element.
          var input = document.getElementById('searchTextField');
          var autocomplete = new google.maps.places.Autocomplete(input);
          ctrl.LocationService.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('searchTrigger')); ctrl.LocationService.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('list-toggle'));

          // Bias the SearchBox results towards current map's viewport.
          ctrl.LocationService.map.addListener('bounds_changed', function() {
            autocomplete.setBounds(ctrl.LocationService.map.getBounds());
          });

          // limit panning to current circle
          google.maps.event.addListener(ctrl.LocationService.map,'center_changed',function() { checkBounds(); });

          function checkBounds() {
              var allowedBounds = ctrl.rangeCirclemarker.getBounds();
              if(! allowedBounds.contains(ctrl.LocationService.map.getCenter())) {
                var C = ctrl.LocationService.map.getCenter();
                var X = C.lng();
                var Y = C.lat();

                var AmaxX = allowedBounds.getNorthEast().lng();
                var AmaxY = allowedBounds.getNorthEast().lat();
                var AminX = allowedBounds.getSouthWest().lng();
                var AminY = allowedBounds.getSouthWest().lat();

                if (X < AminX) {X = AminX;}
                if (X > AmaxX) {X = AmaxX;}
                if (Y < AminY) {Y = AminY;}
                if (Y > AmaxY) {Y = AmaxY;}

                ctrl.LocationService.map.setCenter(new google.maps.LatLng(Y,X));
              }
          }

          // [START region_getplaces]
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          autocomplete.addListener('place_changed', function() {
              var place = autocomplete.getPlace();

              if (!place) {
                return;
              }

              // Clear out the old markers.
              markers.forEach(function(marker) {
                  marker.setMap(null);
              });
              markers = [];

              // Create a marker
              markers.push(new google.maps.Marker({
                  map: ctrl.LocationService.map,
                  title: place.name,
                  position: place.geometry.location
              }));
              ctrl.LocationService.map.panTo(place.geometry.location);

              console.log(place);

              ctrl.LocationService.lastSearch.coords = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()};
              socket.emit('position', ctrl.LocationService.lastSearch.coords);
          });
          // [END region_getplaces]
      };
      google.maps.event.addDomListener(window, 'load', ctrl.LocationService.getGeoLocation());

    }

    /*
     * END OF MAP TYPE SPECIFIC CODE
     * BELOW IS CODE WHICH MUST APPLY REGARDLESS OF MAP TYPE
     */
//    socket.on('places', ctrl.loadPlaces); // should call interface
  };

  return ['$scope', '$timeout', '$http', '$log', 'LocationService', locationMapController];

});
