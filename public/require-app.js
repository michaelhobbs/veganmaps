// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

/**
  * main requirejs config file. Bootstraps the angular app.
  */
// function(requirejs) {
  'use strict';

  requirejs.config({
      baseUrl: 'javascripts',
      paths: {
          // locationList : 'modules/locationList/locationListModule',
          // locationDetail : 'modules/locationDetail/locationDetailModule',
          // locationAdd : 'modules/locationAdd/locationAddModule',
          // locationEdit : 'modules/locationEdit/locationEditModule',
          rzModule : '../lib/angularjs-slider/dist/rzslider',
          ngRoute : '../lib/angular-route/angular-route',
          angular : '../lib/angular/angular',
          text : '../lib/text/text',
          socketio : '../socket.io/socket.io'
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

// })(requirejs);




/*
script(type='text/javascript', src='lib/angular/angular.js')
script(type='text/javascript', src='lib/angular-route/angular-route.js')
script(type='text/javascript', src='lib/angular-animate/angular-animate.js')
script(type='text/javascript', src='lib/angularjs-slider/dist/rzslider.min.js')
script(type='text/javascript', src="javascripts/app.js")
script(type='text/javascript', src="javascripts/appConfig.js")
script(type='text/javascript', src="javascripts/modules/locationList/locationListModule.js")
script(type='text/javascript', src="javascripts/modules/locationList/locationListComponent.js")
script(type='text/javascript', src="javascripts/modules/locationDetail/locationDetailModule.js")
script(type='text/javascript', src="javascripts/modules/locationDetail/locationDetailComponent.js")
script(type='text/javascript', src="javascripts/modules/locationAdd/locationAddModule.js")
script(type='text/javascript', src="javascripts/modules/locationAdd/locationAddComponent.js")
script(type='text/javascript', src="javascripts/modules/locationEdit/locationEditModule.js")
script(type='text/javascript', src="javascripts/modules/locationEdit/locationEditComponent.js")*/
