var Location = require('../models/locationSchema');
var findLocation = function(query, success, socket) {
    var limit = query.limit || 10;

    // get the max distance or set it to 8 kilometers
    var maxDistance = query.distance || 8;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 6371;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = query.longitude;
    coords[1] = query.latitude;

    console.log("Query coods: ", coords);
    // find a location
    Location.find({
      loc: {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).limit(limit).exec(function(err, locations) {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(locations.length);
      success(locations, socket);
      return locations;
    });
}

module.exports = findLocation;
