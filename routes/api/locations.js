var express = require('express');
var router = express.Router();
var Location = require('../../models/locationSchema');

/* GET a location by id */
router.get('/:locationId', function(req, res, next) {
        console.log('[api call]: GET location by ID: ' + req.params.locationId);
        Location.findById(req.params.locationId, function(err, doc) {
          if (err) {
            res.send(err);
          }
          console.log('[api call]: GET location by ID: ', doc);
          res.json(doc);
        });
});

// UPDATE a location by id
router.put('/:locationId', function(req, res, next) {
        console.log('[api call]: PUT location by ID: ' + req.params.locationId);
        if (req.body._id !== req.params.locationId) {
          res.status(500).send('Invalid object. ID has been modified.');
        }
        Location.findById(req.params.locationId, function(err, doc) {
          if (err) {
            res.send(err);
          }
          doc = req.body;
          doc.save(function(err) {
            console.log('[api call]: PUT location by ID: ', doc);
            res.json({message: 'Update successful.'});
          });
        });
});

// INSERT a new location
router.put('/', function(req, res, next) {
        console.log('[api call]: PUT new location');
        // TODO make DB call
        Location.findById(req.params.locationId, function(err, doc) {
          if (err) {
            res.send(err);
          }
          doc = req.body;
          doc.save(function(err) {
            console.log('[api call]: PUT location by ID: ', doc);
            res.json({message: 'Update successful.'});
          });
        });
});

module.exports = router;
