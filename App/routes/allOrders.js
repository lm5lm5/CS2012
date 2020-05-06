var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select *, order_time::text as order_date from foodlists natural join customerlogin natural join Riders order by flid';

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    console.log("myquery " + sql_query);
    pool.query(sql_query, (err, data) => {
        if (err) {
            res.redirect('managerProfile');
        } else {
            res.render('allOrders', {orderdata: data.rows})
        }
    });
});

module.exports = router;
