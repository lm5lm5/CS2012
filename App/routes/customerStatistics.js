var express = require('express');
var router = express.Router();

const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


/* SQL Query */
var sql_query = 'with deliverylist as (select *, coalesce(rating::text, \'no rating\') as ratingtext, '
    + 'order_time::text as order_date '
    + 'from foodlists natural join delivers ';
var sql_query2 = 'where order_time >= \'';
var sql_query3 = '\' and order_time < \'';
var sql_query31 = '\' and cid = \'';


// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    res.render('customerStatistics', {})
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var month = req.body.month;
    var id = req.body.id;
    console.log("start: " + startdate);
    console.log("end: " + enddate);
    console.log("month: " + month);
    console.log("id: " + id);

    var start, end;
    if (startdate.length !== 0 && enddate.length !== 0) {
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
    var sql_query4 = sql_query + sql_query2 + start + sql_query3 + end + sql_query31 + id + '\') ';
    var insert_query = sql_query4 + 'select * from deliverylist order by did';
    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            sess = req.session;
            sess.error = err.stack;
            sess.errortype = 'invalid input';
            res.redirect('/customerStatistics');
            return;
        }
        console.log(data.rows);
        console.log(data.rowCount);
        sess = req.session;
        sess.error = null;
        sess.customerdata = data.rows;
        sess.start = start;
        sess.end = end;
        console.log('start: ' + start);
        console.log('end: ' + end);
        var insert_query2 = 'select * '
            + 'from customer C natural join customerlogin where cid = \'' + id + '\'';
        console.log('query2: ' + insert_query2);
        pool.query(insert_query2, (err, data) => {
            if (err) {
                console.log(err.stack);
                sess = req.session;
                var errormessage = err.stack;
                sess.error = errormessage;
                sess.errortype = 'invalid input';
                res.redirect('/customerStatistics');
                return;
            }
            console.log(data.rows);
            sess.customerdata2 = data.rows;
            var insert_query3 = sql_query4 + 'select count(distinct flid) as num, coalesce(sum(total_cost), 0) as cost, '
                + 'coalesce(max(total_cost), 0) as max from deliverylist';
            console.log('query3: ' + insert_query3);
            pool.query(insert_query3, (err, data) => {
                if (err) {
                    console.log(err.stack);
                    sess = req.session;
                    sess.error = err.stack;
                    sess.errortype = 'invalid input';
                    res.redirect('/customerStatistics');
                    return;
                }
                console.log(data.rows);
                sess.customerdata3 = data.rows;
                res.redirect('/customerStatisticsResult');
            });
        });
    });
});

module.exports = router;
