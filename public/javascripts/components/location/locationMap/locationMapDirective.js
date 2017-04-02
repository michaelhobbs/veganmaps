define(function(require) {

  'use strict';

  return {
    template : require('text!./locationMapTemplate.html'),
    controller : require('./locationMapController')
    // require: { locationContainer: '^locationContainer'}
    // bindings : { location : '<'}
  };
});
