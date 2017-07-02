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
  var module = angular.module('formsComponent', []);

  // load routes
  module
    .component('locationForm', require('./locationForm/locationFormDirective'));

  return module.name;
});
