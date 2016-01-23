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
    loc: [8.5233656,47.3787028]
    }).save(savecb);


    new Location({
    name: "Sasou Saftbar",
    latitude: 47.3822901,
    longitude: 8.5300069,
    loc: [8.5300069,47.3822901]
    }).save(savecb);


    new Location({
    name: "SamSeS",
    latitude: 47.3839146,
    longitude: 8.5308147,
    loc: [8.5308147,47.3839146]
    }).save(savecb);


    new Location({
    name: "Hiltl",
    latitude: 47.3732974,
    longitude: 8.5366795,
    loc: [8.5366795,47.3732974]
    }).save(savecb);


    new Location({
    name: "Vegelateria",
    latitude: 47.3760837,
    longitude: 8.5288607,
    loc: [8.5288607,47.3760837]
    }).save(savecb);


    new Location({
    name: "Maison Blunt",
    latitude: 47.3836628,
    longitude: 8.5283872,
    loc: [8.5283872,47.3836628]
    }).save(savecb);
}

module.exports = initMockDB;
