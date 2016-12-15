'use strict';

function locationListController($scope) {//}$scope, $element, $attrs) {
  var ctrl = this;
  //
  // // This would be loaded by $http etc.
  // ctrl.list = [
  //   {
  //     name: 'Superman',
  //     location: ''
  //   },
  //   {
  //     name: 'Batman',
  //     location: 'Wayne Manor'
  //   }
  // ];
  //
  // ctrl.updateHero = function(hero, prop, value) {
  //   hero[prop] = value;
  // };
  //
  // ctrl.deleteHero = function(hero) {
  //   var idx = ctrl.list.indexOf(hero);
  //   if (idx >= 0) {
  //     ctrl.list.splice(idx, 1);
  //   }
  // };

  var socket = io.connect('http://localhost:3000');

  ctrl.getGeoLocation = function(success) {
      var defaultMapPosition =  {coords: {latitude: 47.3841831, longitude: 8.5329786}};
      if(navigator.geolocation) {
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
              center: initialLocation
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
              socket.emit('position', newPosition);
          });
          // [END region_getplaces]

      }
      initialize();
  };
  google.maps.event.addDomListener(window, 'load', ctrl.getGeoLocation(ctrl.useGeoLocation));

  socket.on('places', loadPlaces);

  function loadPlaces(places) {
    console.log('Loading places.', places);
    ctrl.locationList = places;
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
  }

    document.getElementById("list-toggle").addEventListener("click", toggleList, true);

  function toggleList() { // TODO: replace with adding/removing a 'list-hidden' class which is responsive.
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

  // ctrl.locationList = [
  //   {
  //     "name": "Marktküche",
  //     "latitude": 47.3787028,
  //     "longitude": 8.5233656,
  //     "loc": [8.5233656,47.3787028]
  //   }
  //   , {
  //     "name": "Maison Blunt",
  //     "latitude": 47.3836628,
  //     "longitude": 8.5283872,
  //     "loc": [8.5283872,47.3836628]
  //   }
  //   , {
  //     "name": "Hiltl",
  //     "latitude": 47.3732974,
  //     "longitude": 8.5366795,
  //     "loc": [8.5366795,47.3732974]
  //   }
  // ];
}


// Register `locationList` component, along with its associated controller and template
angular.
  module('locationList').
  component('locationList', {
    templateUrl: '/javascripts/modules/locationListTemplate.html',
    controller: locationListController,
    bindings: {
      locationList: '<'
    }
  });
