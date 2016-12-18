// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var locationSchema = new Schema({
  name: {
        type: String,
        required: true
      },
  address: String,
  latitude: {
        type: Number,
        required: true
      },
  longitude: {
        type: Number,
        required: true
      },
  loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  gf: Boolean,
  bio: Boolean,
  raw: Boolean,
  fullv: Boolean,
  vOpt: Boolean,
  vOnReq: Boolean,
  local: Boolean,
  meat: Boolean,
  url: String,
  phone: String,
  picPath: String,
  openTimes: [Number],
  created_at: {
        type: Date,
        required: true
      },
  updated_at: {
        type: Date,
        required: true
      }
});

// the schema is useless so far
// we need to create a model using it
var Location = mongoose.model('Location', locationSchema);

// make this available to our locations in our Node applications
module.exports = Location;
