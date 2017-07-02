define(function(require) {

  'use strict';

  return {
    template : require('text!./locationFormTemplate.html'),
    controller : require('./locationFormController'),
    bindings: {
      location: '<'
    }
  }
});
