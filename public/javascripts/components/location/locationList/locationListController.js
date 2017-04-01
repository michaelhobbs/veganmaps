define(function(require) {

  'use strict';
  var io = require('socketio');

  function locationListController($scope, $timeout, LocationService) {
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
                zoom: 14,
                minZoom: 10,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                center: initialLocation,
                styles: [
                  {"featureType":"all","elementType":"geometry","stylers":[{"saturation":"18"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#3577ad"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#661212"}]},{"featureType":"all","elementType":"labels","stylers":[{"color":"#682828"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"geometry.fill","stylers":[{"color":"#822626"},{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#37312c"},{"lightness":"0"},{"saturation":"-13"},{"weight":"2"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"off"},{"weight":"0.01"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#52463b"},{"weight":"4.89"},{"lightness":"11"},{"gamma":"1"},{"visibility":"off"},{"saturation":"0"}]},{"featureType":"administrative.province","elementType":"geometry.fill","stylers":[{"color":"#c06969"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#252525"},{"visibility":"on"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry.fill","stylers":[{"color":"#252525"},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":"18"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2},{"visibility":"on"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#2c2c28"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#252525"},{"lightness":18},{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#863131"},{"lightness":16},{"visibility":"on"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#282a32"},{"lightness":"4"}]}]
            };
            ctrl.globalMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var markers = [new google.maps.Marker({
                position: initialLocation,
                map: ctrl.globalMap,
                draggable: false
            })];

            // Create the search box and link it to the UI element.
            var input = document.getElementById('searchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            ctrl.globalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('searchTrigger')); ctrl.globalMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('list-toggle'));

            // Bias the SearchBox results towards current map's viewport.
            ctrl.globalMap.addListener('bounds_changed', function() {
              autocomplete.setBounds(ctrl.globalMap.getBounds());
            });

            // limit panning to current circle
            google.maps.event.addListener(ctrl.globalMap,'center_changed',function() { checkBounds(); });

            function checkBounds() {
                var allowedBounds = ctrl.rangeCirclemarker.getBounds();
                if(! allowedBounds.contains(ctrl.globalMap.getCenter())) {
                  var C = ctrl.globalMap.getCenter();
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

                  ctrl.globalMap.setCenter(new google.maps.LatLng(Y,X));
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

      ctrl.updateCircleRange();
    }

    ctrl.toggleList = function() { // TODO: replace with adding/removing a 'list-hidden' class which is responsive.
        ctrl.LocationService.listView = !ctrl.LocationService.listView;
        $timeout(function () {
          google.maps.event.trigger(ctrl.globalMap, "resize");
        },10);

    }

    ctrl.toggleOptions = function() {
      $timeout(function () {
              $scope.$broadcast('rzSliderForceRender');
      });
      $scope.showOptions = !$scope.showOptions;
    }

    ctrl.filterExpression = function(value) {
      var typeFilterValidates = (ctrl.LocationService.lastSearch.filterProp === 'all' || value[ctrl.LocationService.lastSearch.filterProp] === true);
      var distanceFilterValidates = $scope.slider.value >= value.distance;
      return typeFilterValidates && distanceFilterValidates;
    }

    ctrl.updateCircleRange = function() {
      if (ctrl.rangeCirclemarker) {
        ctrl.rangeCirclemarker.setMap(null);
      }
      ctrl.rangeCirclemarker = new google.maps.Circle({
        strokeColor: '#00FF00',
        strokeOpacity: 0.35,
        strokeWeight: 2,
        fillColor: '#FFFFFF',
        fillOpacity: 0.05,
        map: ctrl.globalMap,
        center: new google.maps.LatLng(ctrl.pos.latitude, ctrl.pos.longitude),
        radius: $scope.slider.value
      });

    }

    $scope.slider = {
      value: 2000,
      options: {
        onEnd: ctrl.updateCircleRange,
        hideLimitLabels: true,
        hidePointerLabels: true,
        showTicks: true,
        stepsArray: [
          {value: 500, legend: '500m'},
          {value: 1000, legend: '1km'},
          {value: 2000, legend: '2km'},
          {value: 5000, legend: '5km'},
          {value: 10000, legend: '10km'}
        ]
      }
    };

  };

  return ['$scope', '$timeout', 'LocationService', locationListController];

});
