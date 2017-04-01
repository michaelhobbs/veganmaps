define(function(require) {

  'use strict';

  return {
    template : require('text!./locationAddTemplate.html'),
    controller : require('./locationAddController')
    // require: { locationContainer: '^locationContainer'}
    // bindings : { location : '<'}
  }
});
