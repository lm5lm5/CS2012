var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query = 'with orderlist as (select * from foodlists natural join customerlogin natural join Riders ';
var sql_query2 = 'where order_time >= \'';
var sql_query3 = '\' and order_time < \'';

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
    var month = req.body.month;
    console.log("start: " + startdate);
    console.log("end: " + enddate);
    console.log("month: " + month);

    var start, end;
    if (startdate !== 0 && enddate !== 0) {
        start = startdate;
        end = enddate;
    } else {
        var yyyy = month.split('-')[0];
        var mm = month.split('-')[1];
        start = month + '-01';
        if (mm == '12') {
            end = (parseInt(yyyy, 10) + 1) + '-' + '01' + '-01';
        } else {
            end = yyyy + '-' + ('0' + (parseInt(mm, 10) + 1)).slice(-2) + '-01';
        }
    }
    // Construct Specific SQL Query
    var sql_query4 = sql_query + sql_query2 + start + sql_query3 + end + '\' order by flid) ';
    var insert_query = sql_query4
        + 'select coalesce(count(distinct flid), 0) as num, coalesce(sum(total_cost), 0) as cost, '
        + 'coalesce(max(total_cost), 0) as maxcost, coalesce(count(distinct cid), 0) as customer, '
        + 'coalesce(count(distinct riderid), 0) as rider '
        + 'from orderlist';

    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            sess = req.session;
            var errormessage = err.stack;
            sess.error = errormessage;
            sess.errortype = 'invalid dates';
            res.redirect('/orderStatistics');
        } else {
            console.log(data.rows);
            sess = req.session;
            sess.error = null;
            sess.orderdata = data.rows;
            sess.start = start;
            sess.end = end;
            console.log('start: ' + start);
            console.log('end: ' + end);
            var insert_query2 = sql_query4
                + 'select cid, username, count(distinct flid) as count, sum(total_cost) as cost, '
                + 'max(total_cost) as maxcost '
                + 'from orderlist group by (cid, username) order by cid';
            console.log('query2: ' + insert_query2);
            pool.query(insert_query2, (err, data) => {
                if (err) {
                    console.log(err.stack);
                    sess = req.session;
                    var errormessage = err.stack;
                    sess.error = errormessage;
                    res.redirect('/orderStatistics');
                } else {
                    console.log(data.rowCount);
                    sess.orderdata2 = data.rows;
                    res.redirect('/orderStatisticsResult');
                }
            });
        }
    });
});

module.exports = router;
