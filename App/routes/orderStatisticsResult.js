var express = require('express');
var router = express.Router();

// const {Pool} = require('pg')
//
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });

// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
    }
    res.render('orderStatisticsResult', {})
});


module.exports = router;
