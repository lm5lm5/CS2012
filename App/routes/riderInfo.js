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
var sql_query31 = '\' and riderid = \'';


// GET
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.managername == null || sess.mid == null) {
        console.log("manager not logged in yet");
        res.redirect('/manager');
        return;
    }
    res.render('riderInfo', {})
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
    var insert_query = sql_query4 + 'select *, to_char(customerplaceorder, \'yyyy-MM-dd HH24:mm:ss\') as order, '
        + 'to_char(riderdeliverorder - customerplaceorder, \'HH24:MI:SS\') as ordertime, '
        + 'to_char(riderleftrest - customerplaceorder, \'HH24:MI:SS\') as deliverytime from deliverylist order by flid';

    console.log('query: ' + insert_query);

    pool.query(insert_query, (err, data) => {
        if (err) {
            console.log(err.stack);
            sess = req.session;
            sess.error = err.stack;
            sess.errortype = 'invalid input';
            res.redirect('/riderInfo');
            return;
        }
        console.log(data.rows);
        sess = req.session;
        sess.error = null;
        sess.riderdata2 = data.rows;
        sess.start = start;
        sess.end = end;
        console.log('start: ' + start);
        console.log('end: ' + end);
        var insert_query2 = 'with totalworkinghours as (with fulltimers as (with fulltime as (select riderid, 40 hours from fulltimeriders) select riderid, case when hours is null then 0 else hours end from riders left join fulltime using (riderid)), parttimers as (select riderid, case when sum(totalhours) is null then 0 else sum(totalhours) end totalhours from riders left join ((holds natural join sessions) natural join wws) using (riderid) group by riderid order by riderid) select riderid, hours + totalhours totalhours from fulltimers natural join parttimers), totalsalary as (with riderbasesalary as (SELECT distinct riderid, CASE WHEN wwsid IS NOT NULL then (weeklybasesalary * 4) ELSE monthlybasesalary END AS salary FROM (riders LEFT JOIN fulltimeriders using (riderid) LEFT JOIN parttimeriders USING (riderid) left join wws using (riderid)) ), ridernumdeliveries as (select riderid, count(*) numofdeliveries from delivers group by riderid) select riderid, case when numofdeliveries is null then salary else (salary + (numofdeliveries * 5)) end totalsalary, salary, case when numofdeliveries is null then 0 else numofdeliveries end from riderbasesalary left join ridernumdeliveries using(riderid) order by riderid) select *, case when riderid in (select riderid from parttimeriders) then \'part timer\' when riderid in (select riderid from fulltimeriders) then \'full timer\' else \'error\' end as status, ridername from(totalworkinghours natural join totalsalary) natural join riders where riderid = '
            + id;
        console.log('query2: ' + insert_query2);
        pool.query(insert_query2, (err, data) => {
            if (err) {
                console.log(err.stack);
                sess = req.session;
                var errormessage = err.stack;
                sess.error = errormessage;
                sess.errortype = 'invalid input';
                res.redirect('/riderInfo');
                return;
            }
            console.log(data.rows);
            sess.riderdata = data.rows;
            var insert_query3 = sql_query4 + 'select count(flid) as num, coalesce(count(rating), 0) as ratings, '
                + 'coalesce(avg(rating)::decimal(10, 2)::text, \'no rating\') as rating, '
                + 'count(distinct cid) as customer, coalesce(to_char(avg(riderleftrest - customerplaceorder), \'HH24:MI:SS\'), \'NA\') as avgtime '
                + 'from deliverylist';
            console.log('query3: ' + insert_query3);
            pool.query(insert_query3, (err, data) => {
                if (err) {
                    console.log(err.stack);
                    sess = req.session;
                    sess.error = err.stack;
                    sess.errortype = 'invalid input';
                    res.redirect('/riderInfo');
                    return;
                }
                console.log(data.rows);
                sess.riderdata3 = data.rows;
                res.redirect('/riderInfoResult');
            });
        });
    });
});

module.exports = router;
