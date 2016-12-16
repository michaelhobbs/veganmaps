'use strict';

// Define the `veganmaps` module
angular.module('veganmaps', [
  // external dependencies
  'ngRoute', // TODO: replace/augment with ui-router, preserve data and state between views
  // ...which depends on the `locationList` module
  'locationList',
  'locationDetail'
]).service('LocationService', function(){
  this.lastSearch = {filterProp : 'all', orderProp: 'closest'}; // coords, results, filterSelection, orderBySelection
  this.currentLocation = {}; // to have detail displayed or to be edited
  this.listView = false; // by default list view is hidden
});;
