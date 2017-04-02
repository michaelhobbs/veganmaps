// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

/**
  * main requirejs config file. Bootstraps the angular app.
  */
  'use strict';

  requirejs.config({
      baseUrl: 'javascripts',
      paths: {
          rzModule : '../lib/angularjs-slider/dist/rzslider',
          ngRoute : '../lib/angular-route/angular-route',
          angular : '../lib/angular/angular',
          text : '../lib/text/text',
          socketio : '../socket.io/socket.io',
          leaflet : '../lib/leaflet/dist/leaflet'
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
