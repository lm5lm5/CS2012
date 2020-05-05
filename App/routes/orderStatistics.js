var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'with orderlist as (select * from foodlists natural join customerlogin natural join Riders ';
var sql_query2 = 'where order_time >= \'';
var sql_query3 = '\' and order_time <= \'';

// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
    }
    res.render('orderStatistics', {})
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    console.log("start: " + startdate);
    console.log("end: " + enddate);

    // Construct Specific SQL Query
    var insert_query = sql_query + sql_query2 + startdate + sql_query3 + enddate + '\' order by flid) ' +
        'select coalesce(count(flid), 0) as num, coalesce(sum(total_cost), 0) as cost, '
        'coalesce(max(total_cost), 0) as maxcost '
        + 'from orderlist';

    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            //alert(err.stack);
            sess = req.session;
            var errormessage = err.stack;
            sess.error = errormessage;
            sess.errortype = 'invalid dates';
            res.redirect('/orderStatistics');
        } else {
            console.log(data.rows);
            console.log(data.rowCount);
            // if (data.rowCount > 0) {
                sess = req.session;
                sess.error = null;
                sess.orderdata = data.rows;
                res.redirect('/orderStatisticsResult')
            // } else {
            //     sess = req.session;
            //     sess.error = "Invalid Dates, or no order within the period";
            //     sess.errortype = 'invalid dates';
            //     res.redirect('/orderStatistics');
            // }
        }
    });
});

module.exports = router;
