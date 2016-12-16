angular.
  module('veganmaps').
  config(['$routeProvider',
    function config($routeProvider) {

      $routeProvider.
        when('/', {
          template: '<location-list></location-list>'
        }).
        when('/id/:locationId', {
          template: '<location-detail></location-detail>'
        }).
        otherwise('/');
    }
  ]);
