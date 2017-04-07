define(function(require) {

  'use strict';

  return {
    template : require('text!./landingWelcomeTemplate.html'),
    controller : require('./landingWelcomeController')
  };
});
