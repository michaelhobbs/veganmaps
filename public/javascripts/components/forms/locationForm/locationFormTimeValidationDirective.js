define(function(require) {

  'use strict';

  var moment = require('moment');

  return function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.isAfter = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return false;
          }

          if (moment(modelValue).isAfter(moment(scope.$eval(attrs.isAfter))) || (moment(modelValue).minutes() === 0 && moment(modelValue).hours() === 0)) {
            // it is valid
            return true;
          }

          // it is invalid
          return false;
        };
      }
    };
  };
}

);
