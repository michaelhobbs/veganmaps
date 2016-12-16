'use strict';

function locationListController($scope, LocationService) {
  var ctrl = this;
  ctrl.LocationService = LocationService;

  var socket = io.connect('http://localhost:3000');

  ctrl.distance = function (lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
      var km = 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
      var m = km * 1000;
      return Math.round(m);
  }

  ctrl.pos = {};
  ctrl.getGeoLocation = function(success) {
      var defaultMapPosition =  {coords: {latitude: 47.3841831, longitude: 8.5329786}};
      ctrl.pos = defaultMapPosition.coords;
      ctrl.LocationService.lastSearch.coords = ctrl.pos;
      if (navigator.geolocation) {
          var pos;
          navigator.geolocation.getCurrentPosition(function(position) {
                      success(position);
                      //      map.setCenter(initialLocation);
                    }, function(error) {
                            console.log(error);
                            success(defaultMapPosition);
                    });
                    return pos;
      }
  };

  ctrl.globalMap;
  var veganMarkers = [];
  ctrl.useGeoLocation = function(position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var initialPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      socket.emit('position', initialPosition);
      console.log('Sending server location:', initialPosition);
      function initialize() {
          var mapOptions = {
              /*styles: [
                 {
                   featureType: "poi",
                   stylers: [
                    { visibility: "off" }
                   ]
                  }
              ],*/
              zoom: 14,
              center: initialLocation,
              styles: [
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#f49f53"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#f9ddc5"
            },
            {
                "lightness": -7
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#1994bf"
            },
            {
                "saturation": -69
            },
            {
                "gamma": 0.99
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "weight": 1.3
            },
            {
                "visibility": "on"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi.business"
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 39
            }
        ]
    },
    {
        "featureType": "poi.school",
        "stylers": [
            {
                "color": "#a95521"
            },
            {
                "lightness": 35
            }
        ]
    },
    {},
    {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 38
            },
            {
                "visibility": "off"
            }
        ]
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {
        "elementType": "labels"
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 32
            }
        ]
    },
    {},
    {
        "featureType": "poi.government",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 46
            }
        ]
    },
    {
        "featureType": "transit.station",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "lightness": -10
            }
        ]
    },
    {},
    {},
    {}
]
          };
          ctrl.globalMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

          var markers = [new google.maps.Marker({
              position: initialLocation,
              map: ctrl.globalMap,
              draggable: false
          })];
          // Create the search box and link it to the UI element.
          var input = document.getElementById('pac-input');
          var searchBox = new google.maps.places.SearchBox(input); // TODO: replace with autocomplete instead of searchbox
          ctrl.globalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          // Bias the SearchBox results towards current map's viewport.
          ctrl.globalMap.addListener('bounds_changed', function() {
          searchBox.setBounds(ctrl.globalMap.getBounds());
          });
          // [START region_getplaces]
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', function() {
              var places = searchBox.getPlaces();

              if (places.length == 0) {
                return;
              }

              // Clear out the old markers.
              markers.forEach(function(marker) {
                  marker.setMap(null);
              });
              markers = [];

              // For each place, get the icon, name and location.
              var place = places[0];

              // Create a marker for each place.
              markers.push(new google.maps.Marker({
                  map: ctrl.globalMap,
                  title: place.name,
                  position: place.geometry.location
              }));
              ctrl.globalMap.panTo(place.geometry.location);
              console.log(place);
              var newPosition = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()};

              ctrl.pos = newPosition;
              ctrl.LocationService.lastSearch.coords = ctrl.pos;
              socket.emit('position', newPosition);
          });
          // [END region_getplaces]

          /*
          getDirections(coordsStart, coordsEnd) [
          linkURL: https://www.google.com/maps/dir/44.12345,-76.12345/43.12345,-76.12345
          ]
          */

      }
      initialize();
  };
  google.maps.event.addDomListener(window, 'load', ctrl.getGeoLocation(ctrl.useGeoLocation));

  socket.on('places', loadPlaces);

  function loadPlaces(places) {
    console.log('Loading places.', places);
    ctrl.locationList = places;
    places.forEach (function(place) {
      place.distance = ctrl.distance(place.latitude, place.longitude, ctrl.pos.latitude, ctrl.pos.longitude);
    });

    ctrl.LocationService.lastSearch.results = ctrl.locationList;
    $scope.$apply();
    // Clear out the old markers.
    veganMarkers.forEach(function(marker) {
        marker.setMap(null);
    });
    veganMarkers = [];
    var index = 0;
      places.forEach (function(place) {
          console.log('Found close place: ', place);
          var latLng = new google.maps.LatLng(place.latitude, place.longitude);
          veganMarkers.push(new google.maps.Marker({
              position: latLng,
              map: ctrl.globalMap,
              draggable: false,
              animation: google.maps.Animation.DROP,
              icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }));
      });


    if (ctrl.LocationService.listView) {
      ctrl.LocationService.listView = !ctrl.LocationService.listView;
      ctrl.toggleList();
    }
  }

  ctrl.toggleList = function() { // TODO: replace with adding/removing a 'list-hidden' class which is responsive.
      ctrl.LocationService.listView = !ctrl.LocationService.listView;
      var placesList = document.getElementById("list-view");
      if (placesList !== null && (placesList.style.display === "none" || placesList.style.display === "")) {
          document.getElementById('map-canvas').style.width = "70%";
          placesList.style.display = "inline-block";
      }
      else {
          document.getElementById('map-canvas').style.width = "100%";
          placesList.style.display = "none";
      }
      google.maps.event.trigger(ctrl.globalMap, "resize");
  }

  ctrl.filterExpression = function(value) {
    return (ctrl.LocationService.lastSearch.filterProp === 'all' || value[ctrl.LocationService.lastSearch.filterProp] === true);
  }

}


// Register `locationList` component, along with its associated controller and template
angular.
  module('locationList').
  component('locationList', {
    templateUrl: '/javascripts/modules/locationList/locationListTemplate.html',
    controller: locationListController
  });
