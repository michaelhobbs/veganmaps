var Location = require('../models/locationSchema');
var initMockDB = function() {
  clearDB(populateDB);

};

function clearDB(callback) {
  Location.remove({}, callback);
}

function populateDB() {
    var enb = new Location({
    name: "Elle'n'Belle",
    address: {
      number: 118,
      street: "Limmatstrasse",
      postal_code: "8005",
      city: "Zürich",
      country: "Switzerland"
    },
    latitude: 47.3841831,
    longitude: 8.5329786,
    location: {
      "type": "Point",
      "coordinates": [8.5329786, 47.3841831]
    }, // [longitude, latitude]
    gf: true,
    bio: false,
    raw: false,
    fullv: true,
    local: false,
    meat: false,
    url: "http://www.ellenbelle.ch",
    phone: "044 448 15 20",
    picPath: "d5a121_506227dc77454bedadbb55918e2295a3.jpg",
    openTimes: {
      monday: {
          start: 1100,
          end: 2300
      },
      tuesday: {
          start: 1100,
          end: 2300
      },
      wednesday: {
          start: 1100,
          end: 2300
      },
      thursday: {
          start: 1100,
          end: 2300
      },
      friday: {
          start: 1100,
          end: 2300
      },
      saturday: {
          start: 1100,
          end: 2300
      }
    },
    created_at: new Date,
    updated_at: new Date
    });
    function savecb(err) {
      if (err) throw err;
      console.log('Location saved successfully!');
    }
    // call the built-in save method to save to the database
    enb.save(savecb);

    new Location({
    name: "Marktküche",
    latitude: 47.3787028,
    longitude: 8.5233656,
    location: {
      "type": "Point",
      "coordinates": [8.5233656,47.3787028]},
    gf: false,
    bio: false,
    raw: false,
    fullv: true,
    local: true,
    meat: false,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);


    new Location({
    name: "Sasou Saftbar",
    latitude: 47.3822901,
    longitude: 8.5300069,
    location: {
      "type": "Point",
      "coordinates": [8.5300069,47.3822901]},
    gf: false,
    bio: false,
    raw: true,
    fullv: false,
    local: false,
    meat: false,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);


    new Location({
    name: "SamSeS",
    latitude: 47.3839146,
    longitude: 8.5308147,
    location: {
      "type": "Point",
      "coordinates": [8.5308147,47.3839146]},
    gf: false,
    bio: false,
    raw: false,
    fullv: false,
    local: false,
    meat: false,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);


    new Location({
    name: "Hiltl",
    latitude: 47.3732974,
    longitude: 8.5366795,
    location: {
      "type": "Point",
      "coordinates": [8.5366795,47.3732974]},
    url: "http://www.hiltl.ch",
    picPath: "logo-weiss.png",
    gf: false,
    bio: false,
    raw: false,
    fullv: false,
    local: false,
    meat: false,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);


    new Location({
    name: "Vegelateria",
    latitude: 47.3760837,
    longitude: 8.5288607,
    location: {
      "type": "Point",
      "coordinates": [8.5288607,47.3760837]},
    gf: false,
    bio: true,
    raw: true,
    fullv: true,
    local: false,
    meat: false,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);


    new Location({
    name: "Maison Blunt",
    latitude: 47.3836628,
    longitude: 8.5283872,
    location: {
      "type": "Point",
      "coordinates": [8.5283872,47.3836628]},
    url: "http://www.maison-blunt.ch",
    picPath: "logo_rot.png",
    gf: false,
    bio: false,
    raw: false,
    fullv: false,
    local: false,
    meat: true,
    created_at: new Date,
    updated_at: new Date
    }).save(savecb);
}

module.exports = initMockDB;
