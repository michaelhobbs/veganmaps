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
        console.log('[api call]: PUT new location: ', req.body);

        function savecb(err) {
          console.log('[api call]: callback error: ', err);
          if (err) {
            res.status(500).send(err);
          }
          else {
            res.send('Location saved successully.');
            console.log('Location saved successfully!');
          }
        }

        // var id = req.body._id;
        // console.log('ID: ', id);
        // var query = {_id: id};
        // var options = {
        //   // upsert: true,
        //   setDefaultsOnInsert: true,
        //   runValidators: true // see update validators @http://mongoosejs.com/docs/validation.html . Apparently there are some caveats for using validators with update...
        // }
        var now = new Date();
        // if (id) {
        //   // we are editing an existing locationId
        //   req.body.updated_at = now;
        //   console.log('[api call]: update');
        //   Location.findOneAndUpdate(query, req.body, options, savecb);
        // }
        // else {
          // we are inserting a new locationId
          req.body.created_at = now
          req.body.updated_at = now;
          req.body.loc = [req.body.longitude, req.body.latitude];
          console.log('[api call]: insert');
          var newLocation = new Location(req.body);
          newLocation.save(savecb);

            // swallows the validation error...
            // Location.findOneAndUpdate(query, req.body, { runValidators: true }, savecb);
        // }



        /* NOTE implementation below is nice but validation from mongo does not throw errors. To be investigated. (eg: if name is not in obj but in shema it is required, then update returns success)
        *
        */
        // // or location.update()?
        // console.log('[api call]: insert or update : ', req.body);
        // console.log('[api call]: query [_id: ', id);
        // Location.findOneAndUpdate(query, req.body, { runValidators: false }, savecb);
        //
        //
        // // TODO sanitize / validation
        // // TODO make DB call
        // function savecb(err) {
        //   console.log('[api call]: callback error: ', err);
        //   if (err) {
        //     res.send(err);
        //   }
        //   else {
        //     res.send('Location saved successully.');
        //     console.log('Location saved successfully!');
        //   }
        // }
});

module.exports = router;
