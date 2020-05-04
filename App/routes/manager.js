var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'SELECT * FROM managerLogin WHERE Username = \'';
var sql_query2 = '\' AND password = \'';

// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.error && sess.error != null && sess.errortype == 'cidexist') {
        console.log("error: incorrect account info");
        res.render('manager', {title: 'Manager login', error: sess.error});
        sess.error = null;
        sess.errortype = 'cidexist';
    } else {
        res.render('manager', {title: 'Manager login', error: null});
    }
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var username = req.body.username;
    var password = req.body.password;

    // Construct Specific SQL Query
    var insert_query = sql_query + username + sql_query2 + password + '\'';
    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            //alert(err.stack);
            sess = req.session;
            var errormessage = err.stack;
            sess.error = errormessage;
            sess.errortype = 'midexist';
            res.redirect('/manager');
        } else {
            console.log(data.rows);
            console.log(data.rowCount);
            if (data.rowCount == 1) {
                console.log("correct account info");
                sess = req.session;
                sess.login = 1;
                sess.manager = 1;
                sess.error = null;
                var data = data.rows;
                sess.managername = data[0].username;
                sess.mid = data[0].mid;
                console.log("username: " + sess.managername);
                console.log("mid: " + sess.mid);
                res.redirect('/managerProfile')
            } else {
                sess = req.session;
                sess.error = "Username or password wrong";
                sess.errortype = 'midexist';
                res.redirect('/manager');
            }
        }

    });
});

module.exports = router;
