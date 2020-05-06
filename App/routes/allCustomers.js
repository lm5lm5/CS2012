var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select * from customer natural join customerlogin';

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
    }
    console.log("myquery " + sql_query);
    pool.query(sql_query, (err, data) => {
        console.log(data.rows);
        res.render('allCustomers', {customerdata: data.rows})
    });
});

module.exports = router;
