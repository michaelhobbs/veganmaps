// var socket = io.connect('http://localhost:3000');
//
// function getGeoLocation(success) {
//     var defaultMapPosition =  {coords: {latitude: 47.3841831, longitude: 8.5329786}};
//     if(navigator.geolocation) {
//         var pos;
//         navigator.geolocation.getCurrentPosition(function(position) {
//                     success(position);
//                     //      map.setCenter(initialLocation);
//                   }, function(error) {
//                           console.log(error);
//                           success(defaultMapPosition);
//                   });
//                   return pos;
//     }
// }
//
// var globalNeighborboods;
// var globalMap;
// var veganMarkers = [];
// function useGeoLocation(position) {
//     var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//     var initialPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
//     socket.emit('position', initialPosition);
//     console.log('Sending server location:', initialPosition);
//     function initialize() {
//         var mapOptions = {
//             /*styles: [
//                {
//                  featureType: "poi",
//                  stylers: [
//                   { visibility: "off" }
//                  ]
//                 }
//             ],*/
//             zoom: 14,
//             center: initialLocation
//         };
//         globalMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
//         var markers = [new google.maps.Marker({
//             position: initialLocation,
//             map: globalMap,
//             draggable: false
//         })];
//         // Create the search box and link it to the UI element.
//         var input = document.getElementById('pac-input');
//         var searchBox = new google.maps.places.SearchBox(input); // TODO: replace with autocomplete instead of searchbox
//         globalMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//
//         // Bias the SearchBox results towards current map's viewport.
//         globalMap.addListener('bounds_changed', function() {
//         searchBox.setBounds(globalMap.getBounds());
//         });
//         // [START region_getplaces]
//         // Listen for the event fired when the user selects a prediction and retrieve
//         // more details for that place.
//         searchBox.addListener('places_changed', function() {
//             var places = searchBox.getPlaces();
//
//             if (places.length == 0) {
//               return;
//             }
//
//             // Clear out the old markers.
//             markers.forEach(function(marker) {
//                 marker.setMap(null);
//             });
//             markers = [];
//
//             // For each place, get the icon, name and location.
//             var place = places[0];
//
//             // Create a marker for each place.
//             markers.push(new google.maps.Marker({
//                 map: globalMap,
//                 title: place.name,
//                 position: place.geometry.location
//             }));
//             globalMap.panTo(place.geometry.location);
//             console.log(place);
//             var newPosition = {latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng()};
//             socket.emit('position', newPosition);
//         });
//         // [END region_getplaces]
//
//     }
//     initialize();
// }
// google.maps.event.addDomListener(window, 'load', getGeoLocation(useGeoLocation));
//
// socket.on('places', loadPlaces);
//
// function loadPlaces(places) {
//   console.log('Loading places.', places);
//   // Clear out the old markers.
//   veganMarkers.forEach(function(marker) {
//       marker.setMap(null);
//   });
//   veganMarkers = [];
//   var index = 0;
//     places.forEach (function(place) {
//         console.log('Found close place: ', place);
//         var latLng = new google.maps.LatLng(place.latitude, place.longitude);
//         veganMarkers.push(new google.maps.Marker({
//             position: latLng,
//             map: globalMap,
//             draggable: false,
//             animation: google.maps.Animation.DROP,
//             icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
//         }));
//     });
// }
//
// window.onload=function(){
//     document.getElementById("list-toggle").addEventListener("click", toggleList, true);
// }
//
// function toggleList() { // TODO: replace with adding/removing a 'list-hidden' class which is responsive.
//     var placesList = document.getElementById("list-view");
//     if (placesList !== null && (placesList.style.display === "none" || placesList.style.display === "")) {
//         document.getElementById('map-canvas').style.width = "70%";
//         placesList.style.display = "inline-block";
//     }
//     else {
//         document.getElementById('map-canvas').style.width = "100%";
//         placesList.style.display = "none";
//     }
//     google.maps.event.trigger(globalMap, "resize");
// }
