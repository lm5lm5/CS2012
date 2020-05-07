var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });
//
// /* SQL Query */
// var sql_query = 'select * from managerlogin where username = \'';

router.get('/', function (req, res, next) {
    sess = req.session;
    console.log(sess.managername);
    console.log(sess.mid);
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    sess.ordererror = null;
    sess.cuserror = null;
    sess.ridererror = null;
    sess.locerror = null;
    res.render('managerProfile', {})
});

router.post('/', function (req, res, next) {
    // Retrieve Information
    req.session.destroy();
    res.redirect('/manager');
});

module.exports = router;
