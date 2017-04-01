define(function(require) {

  'use strict';

  return {
    template : require('text!./locationListTemplate.html'),
    controller : require('./locationListController')
  };
});
