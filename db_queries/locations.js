var Location = require('../models/locationSchema');
var findLocation = function(query, success, socket) {
    var limit = query.limit || 10;

    // get the max distance or set it to 10 kilometers by default
    var maxDistance = query.distance || 10000;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = query.longitude;
    coords[1] = query.latitude;

    console.log("Query coods: ", coords);
    // find a location
    Location.find({
      location: {
        $near: {
            $geometry: { type: "Point",  coordinates: coords },
            $maxDistance: maxDistance
          }
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
