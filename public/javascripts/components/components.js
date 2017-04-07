define(function(require) {

  // import 3rd party modules
  var angular = require('angular');

  // import components
  var locationComponent = require('./location/module');
  var landingComponent = require('./landing/module');

  return angular.module('veganmaps.components', [
    // components
    locationComponent,
    landingComponent
  ])
  .name;
});
