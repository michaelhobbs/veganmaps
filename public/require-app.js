// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

/**
  * main requirejs config file. Bootstraps the angular app.
  */
  'use strict';

  requirejs.config({
      waitSeconds: 0,
      baseUrl: 'javascripts',
      paths: {
          rzModule : '../lib/angularjs-slider/dist/rzslider',
          ngRoute : '../lib/angular-route/angular-route',
          angular : '../lib/angular/angular',
          text : '../lib/text/text',
          socketio : '../socket.io/socket.io',
          leaflet : '../lib/leaflet/dist/leaflet',
          leafletgeosearch: '../node/leaflet-geosearch/dist/bundle.min',
          'whatwg-fetch' : '../lib/fetch/fetch'
          // es6: '../lib/requirejs-babel/es6', // added when trying to use bower's leaflet-geosearch, in order to transcompile at load time
          // babel: '../lib/requirejs-babel/babel-5.8.34.min'
      },
      shim: {
        rzModule: {
            deps: ['angular']
        },
        ngRoute: {
            deps: ['angular']
        },
        angular: {
            exports : 'angular'
        },
        socketio: {exports: 'io'}
    },

    priority: [
      'angular'
    ]
  });

  // Start loading the main app file. Put all of
  // your application logic in there.
  require(['whatwg-fetch'], function () {
    requirejs(['app'], function() {
      console.log('requireJS loading success');
    }, function(exception) {
      console.log('requireJS loading error: ', exception.message);
      if (exception.requireModules) {
        console.log('requireModules: ', exception.requireModules);
      }
      if (exception.stack) {
        console.log(exception.stack);
      }
      throw exception.message;
    });
  });
