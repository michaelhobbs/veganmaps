// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var locationSchema = new Schema({
  name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true
      },
  address: {
        number: String, // string not number type because could be 21A, or 45 bis, etc
        street: String,
        postcode: String,
        city: String,
        state: String,
        country: String
      },
  latitude: {
        type: Number,
        required: true,
        max: 90,
        min: -90
      },
  longitude: {
        type: Number,
        required: true,
        max: 180,
        min: -180
      },
  location : {
    type: {
      type: String,
      enum: "Point",
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  flags: {
    gf: Boolean,
    bio: Boolean,
    raw: Boolean,
    fullv: Boolean,
    vOpt: Boolean,
    vOnReq: Boolean,
    local: Boolean,
    meat: Boolean
  },
  url: //{
      String,
      //, match: /^a/  // TODO add URL regex
    //},
  phone: String,
  picPath: String,
  openTimes: {
    1: {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    2: {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    3:  {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    4:  {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    5:  {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    6:  {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]},
    7:  {
        closed: Boolean,
        times: [{
          start: Number,
          end: Number
    }]}
  },
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
