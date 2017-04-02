define(function(require) {
  'use strict';

  return [function() {
    this.lastSearch = {filterProp : 'all', orderProp: 'distance'}; // coords, results, filterSelection, orderBySelection
    this.currentLocation = {}; // to have detail displayed or to be edited
    this.listView = false; // by default list view is hidden
    this.distance = function (lat1, lon1, lat2, lon2) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 +
              c(lat1 * p) * c(lat2 * p) *
              (1 - c((lon2 - lon1) * p))/2;
        var km = 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
        var m = km * 1000;
        return Math.round(m);
    };
  }];
});
