var express = require('express');
var router = express.Router();

// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    res.render('locationStatisticsResult', {locationdata: sess.locationdata, locationdata2: sess.locationdata2,
        date: sess.date})
});


module.exports = router;
