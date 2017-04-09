define(function(require) {

  'use strict';

  return {
    template : require('text!./locationEditTemplate.html'),
    controller : require('./locationEditController'),
    bindings: {
      locationDetails: '<'
    }
  }
});
