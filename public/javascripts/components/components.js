define(function(require) {

  // import 3rd party modules
  var angular = require('angular');

  // import components
  var locationComponent = require('./location/module');
  var landingComponent = require('./landing/module');
  var formsComponent = require('./forms/module');

  return angular.module('veganmaps.components', [
    // components
    locationComponent,
    landingComponent,
    formsComponent
  ])
  .name;
});
