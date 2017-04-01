define(function(require) {

  'use strict';

  return {
    template : require('text!./locationDetailTemplate.html'),
    controller : require('./locationDetailController'),
    bindings: {
      locationDetails: '<'
    }
    // require: { locationContainer: '^locationContainer'}
    // bindings : { location : '<'}
  }
});
