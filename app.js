var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var maps = require('./routes/maps');
var apiLocations = require('./routes/api/locations.js');

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

// serve pages
app.use('/', routes);
app.use('/users', users);
app.use('/maps', maps);

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
function findPlaces(position, success, socket) {
  var searchQuery = {
    longitude: position.longitude,
    latitude: position.latitude,
    limit: 100,
    distance: 150
  }
  findLocation(searchQuery, success, socket);
}


// ---------MONGODB testing----------
//var Location = require('./models/locationSchema');
var initMockDB = require('./mockups/mockLocations');
initMockDB();

/*// create a new location
var enb = new Location({
  name: "Elle'n'Belle",
  address: "Limmatstrasse 118, 8005 Zürich",
  latitude: 47.3841831,
  longitude: 8.5329786,
  loc: [8.5329786,47.3841831],  // [<longitude>, <latitude>]
  gf: true,
  bio: false,
  raw: false,
  fullv: true,
  url: "www.ellenbelle.ch/",
  phone: "044 448 15 20",
  picPath: "https://static.wixstatic.com/media/d5a121_506227dc77454bedadbb55918e2295a3.jpg/v1/fill/w_196,h_147,al_c,q_75,usm_0.50_1.20_0.00/d5a121_506227dc77454bedadbb55918e2295a3.jpg",
  openTimes: [1100,2300,1100,2300,1100,2300,1100,2300,1100,2300,1100,2300,-1,-1],
  created_at: new Date,
  updated_at: new Date
});

// call the built-in save method to save to the database
enb.save(function(err) {
  if (err) throw err;

  console.log('Location saved successfully!');
});*/

//var findLocation = require('./db_queries/locations');
/*var searchQuery = {
  longitude: 8.5329786,
  latitude: 47.3841831,
  limit: 100,
  distance: 8
}

var closePlaces;
function success(results) {
  console.log('Found places results: ', results.length);
  closePlaces = results;
  console.log('Found places: ', closePlaces);
}
findLocation(searchQuery, success);*/

module.exports = app;
