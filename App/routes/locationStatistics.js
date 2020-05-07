var express = require('express');
var router = express.Router();

const {Pool} = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'select distinct delivery_location as loc from foodlists order by delivery_location';
var sql_query2 = 'with list as (select * from (foodlists natural join delivers) where delivery_location = \'';

router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    pool.query(sql_query, (err, data) => {
        if (err) {
            res.redirect('/managerProfile');
            return;
        }
        console.log(data.rows);
        res.render('locationStatistics', {locations: data.rows});
    });
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Information
    var location = req.body.loc;
    var start = req.body.date;
    console.log("location: " + location);
    console.log("date: " + start);

    // Construct Specific SQL Query
    var sql_query3 = sql_query2 + location + '\')';
    var insert_query = sql_query3 + ' select *, to_char(customerplaceorder, \'yyyy-MM-dd HH24:mm:ss\') as time, '
        + 'coalesce(rating::text, \'no rating\') as ratingtext '
        + 'from list where order_time = \'' + start + '\'';
    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            sess = req.session;
            sess.error = err.stack;
            sess.errortype = 'invalid input';
            res.redirect('/locationStatistics');
            return;
        }
        console.log(data.rows);
        sess = req.session;
        sess.error = null;
        sess.locationdata = data.rows;
        sess.date = start;
        var insert_query2 = sql_query3 + ' select delivery_location, count(distinct flid) as order, '
            + 'coalesce(sum(total_cost), 0) as cost, coalesce(max(total_cost), 0) as max '
            + 'from list where order_time = \'' + start + '\' group by delivery_location';
        console.log('query: ' + insert_query2);
        pool.query(insert_query2, (err, data) => {
            console.log(data.rows);
            sess.locationdata2 = data.rows;
            res.redirect('/locationStatisticsResult');
        });

        // pool.query(insert_query2, (err, data) => {
        //     if (err) {
        //         console.log(err.stack);
        //         sess = req.session;
        //         var errormessage = err.stack;
        //         sess.error = errormessage;
        //         sess.errortype = 'invalid input';
        //         res.redirect('/riderInfo');
        //         return;
        //     }
        //     console.log(data.rows);
        //     sess.riderdata = data.rows;
        //     var insert_query3 = sql_query4 + 'select count(flid) as num, coalesce(count(rating), 0) as ratings, '
        //         + 'coalesce(avg(rating)::decimal(10, 2)::text, \'no rating\') as rating, '
        //         + 'count(distinct cid) as customer, coalesce(to_char(avg(riderleftrest - customerplaceorder), \'HH24:MI:SS\'), \'NA\') as avgtime '
        //         + 'from deliverylist';
        //     console.log('query3: ' + insert_query3);
        //     pool.query(insert_query3, (err, data) => {
        //         if (err) {
        //             console.log(err.stack);
        //             sess = req.session;
        //             sess.error = err.stack;
        //             sess.errortype = 'invalid input';
        //             res.redirect('/riderInfo');
        //             return;
        //         }
        //         console.log(data.rows);
        //         sess.riderdata3 = data.rows;
        //         res.redirect('/riderInfoResult');
        //     });
        // });
    });
});

module.exports = router;
