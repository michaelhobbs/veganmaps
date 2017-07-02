define(function(require) {

  'use strict';
  var Lgeo = require('leafletgeosearch');

  function locationAddController($http, $log, $scope, LocationService) {
    var ctrl = this;
    ctrl.oriLocation = {
      name:'',
      longitude: '',
      latitude:'',
      flags: {
        gf: false,
        bio: false,
        raw: false,
        fullv: false,
        //vOpt: false,
        //vOnReq: false,
        local: false,
        meat: false
      },
      openTimes: {
        1:{
          times: []
        },
        2:{
          times: []},
        3:{
          times: []},
        4:{
          times: []},
        5:{
          times: []},
        6:{
          times: []},
        7:{
          times: []}
      }
    };
  };

  return ['$http', '$log', '$scope', 'LocationService', locationAddController];

});
