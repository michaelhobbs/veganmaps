define(function(require) {
  'use strict';

  return [function() {
    this.lastSearch = {filterProp : 'all', orderProp: 'distance'}; // coords, results, filterSelection, orderBySelection
    this.currentLocation = {}; // to have detail displayed or to be edited
    this.listView = false; // by default list view is hidden
  }];
});
