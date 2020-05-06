var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    res.render('deliveryStatistics', {})
});

module.exports = router;
