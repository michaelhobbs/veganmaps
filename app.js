var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var index = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/maps');
var apiLocations = require('./routes/api/locations.js');
var welcome = require('./routes/index');

var app = express();


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/veganmaps');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // serve folders in public as root path
app.use('/lib', express.static(path.join(__dirname, 'bower_components'))); // serve client dependencies under '/lib'
app.use('/node', express.static(path.join(__dirname, 'node_modules'))); // serve client dependencies which do not support bower under '/node'

// serve pages
//app.use('/', routes); // disabled so that the static page from the public dir will be served at server root
app.use('/users', users);
app.use('/maps', maps);
app.use('/welcome', welcome);

// serve api
app.use('/api/locations', apiLocations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// ------------SOCKET.IO STUFF -------
// SOCKET INITIALZATION
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('port', process.env.PORT || 3000);
server.listen(app.get("port"));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('position',  function (position) {
        console.log('Received new position:');
        console.log(position);
        console.log('New user at: ' + position.latitude +','+position.longitude);

        // TODO: find closes places to position
        findPlaces(position, sendPlacesCallback, socket);

    });
});

var findLocation = require('./db_queries/locations');
function sendPlacesCallback(places, socket) {
  console.log('Found places results: ', places.length);
  console.log('Sending places:',places);
  socket.emit('places', places);
}
// TODO: Move DB access & business logic to other modules.
// TODO: Find how not to send the socket through params so that success callback can send response
function findPlaces(position, success, socket) {
  var searchQuery = {
    longitude: position.longitude,
    latitude: position.latitude,
    limit: 100,
    distance: 10000
  }
  findLocation(searchQuery, success, socket);
}


// ---------MONGODB testing----------
//var Location = require('./models/locationSchema');
var initMockDB = require('./mockups/mockLocations');
initMockDB();

module.exports = app;
