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
    res.render('customerStatisticsResult', {customerdata: sess.customerdata, customerdata2: sess.customerdata2,
        startdate: sess.start, enddate: sess.end})
});


module.exports = router;
