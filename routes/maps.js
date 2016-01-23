var express = require('express');
var router = express.Router();
var app = require("../app");

/* GET maps listing. */
router.get('/', function(req, res, next) {
        console.log(app);
        res.render('map', { title: 'Vegan Maps' });
});

module.exports = router;
