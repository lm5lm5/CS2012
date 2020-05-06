var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select delivery_location, count(distinct flid) as order, sum(total_cost) as cost, '
    + 'max(order_time)::text as lastest from foodlists '
    + 'group by delivery_location order by delivery_location';

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
            res.render('allLocations', {orderdata: data.rows})
        }
    });
});

module.exports = router;
