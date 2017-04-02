/**
  * Location module. Provides components which interact with the location DB.
  */
define(function(require) {

  'use strict';

  // load config, could have config for dev and config for prod. Selection of
  // which to use would be made at build time by node.

  // load dependencies
  var angular = require('angular');

  // load location modules
  var module = angular.module('locationComponent', []);

  // load routes
  module
    .component('locationAdd', require('./locationAdd/locationAddDirective'))
    .component('locationDetail', require('./locationDetail/locationDetailDirective'))
    .component('locationEdit', require('./locationEdit/locationEditDirective'))
    .component('locationList', require('./locationList/locationListDirective'))
    .component('locationMap', require('./locationMap/locationMapDirective'));

  return module.name;
});
