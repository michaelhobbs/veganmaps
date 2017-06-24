/**
  * This module initializes the application.
  */
define(function(require) {

  'use strict';

  // module name
  var moduleName = 'veganmaps';

  // load external dependencies
  var angular = require('angular');
  require('ngRoute');
  require('rzModule');
  require('ngMaterial');
  var socketio = require('socketio');

  // load app's submodules
  var components = require('./components/components');
  var libs = require('./lib/libs');

  // create application module
  var app = angular.module(moduleName, [
      // external dependencies
      'ngRoute', // TODO: replace/augment with ui-router, preserve data and state between views
      // ...which depends on the `locationList` module
      // 'ngAnimate',
      'rzModule',
      'ui.bootstrap',
      'ui.bootstrap.timepicker',
      'ngMaterial',
      components
    ]).service('LocationService', require('./services/locationService'))
    .filter('removeDiacriticsFilter', function() {
      var removeDiacritics = require('removeDiacritics');
      return removeDiacritics;
    });

  // load routeConfig
  app.config(require('./routeConfig')); // maybe need to put this in location module

  // add app.run() here if needed

  // bootstrap the application
  angular.element(document).ready(function() {
    angular.bootstrap(document, [moduleName]);
  });

});
