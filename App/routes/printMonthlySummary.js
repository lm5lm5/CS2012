var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
/* --- V7: Using Dot Env ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '********',
  port: 5432,
})
*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var sql_query = 'with Y as (with X as (select distinct f.flId, f.restaurant_name, f.order_time, f.total_cost as beforePromo_cost, f.promoid, c.reward_pts, (select p.discount from promotions p where f.promoid = p.promoid) from foodlists f join customer c on f.cid=c.cid order by restaurant_name) select x.flid, x.restaurant_name, x.order_time, c.fname from x natural join consists c where x.restaurant_name = \''
var sql_query1 = '\'' + ' and order_time >' + '\''; 
var sql_query2 = '\'' + ' and order_time <' + '\'';
var sql_query3 = 'select fname, count(*), order_time from Y group by y.fname, y.order_time order by count desc limit 5';

var sql2_query = 'with commontable as (with X as (select distinct f.flId, f.restaurant_name, f.order_time, f.total_cost as beforePromo_cost, f.promoid, c.reward_pts, (select p.discount from promotions p where f.promoid = p.promoid) from foodlists f join customer c on f.cid=c.cid order by restaurant_name) select flid, restaurant_name, order_time, beforePromo_cost, (beforePromo_cost - reward_pts) / 100 * (100 - discount) as afterPromo_cost from X) select count(*) as total_orders, sum(afterPromo_cost) as total_cost from commontable where restaurant_name =\''
var sql2_query1 = '\'' + ' and order_time >' + '\''; 
var sql2_query2 = '\'' + ' and order_time <' + '\'';


// with Y as (with X as (select distinct f.flId, f.restaurant_name, f.order_time, f.total_cost as beforePromo_cost, f.promoid, c.reward_pts, (select p.discount from promotions p where f.promoid = p.promoid) from foodlists f join customer c on f.cid=c.cid order by restaurant_name) select x.flid, x.restaurant_name, x.order_time, c.fname from x natural join consists c where x.restaurant_name = 'Lombard Medical, Inc.' and order_time > '2020-05-01' and order_time < '2020-05-31') select fname, count(*), order_time from Y group by y.fname, y.order_time order by count desc limit 5;

router.get('/', function (req, res, next) {
  sess = req.session;
  //2020-01
  //month vara
  console.log("sess.month: " + sess.month);
  console.log("sess.year: " + sess.year);
  // 2020-01-01
  // 2020-0
  // var date = new Date();
  var firstDay = sess.year + '-' + sess.month + '-' + new Date(sess.year, sess.month - 1, 1).getDate();
  var lastDay =  sess.year + '-' + sess.month + '-' + new Date(sess.year, sess.month, 0).getDate();
  console.log("---------------------------------------------------------------------");
  console.log("firstDay: " + firstDay);
  console.log("lastDay: " + lastDay);

  var sql_query4 = sql_query + sess.rname + sql_query2 + lastDay + sql_query1 + firstDay + '\')';
  var sql_query5 = sql_query4 + sql_query3;

  sql2_query3 =  sql2_query + sess.rname + sql2_query2 + lastDay + sql2_query1 + firstDay + '\'';



  console.log("print sql: " + sql_query5);
  console.log("print sql2: " + sql2_query3);

  pool.query(sql2_query3, (err, data) => {
    pool.query(sql_query5, (err, data2) => {
      res.render('printMonthlySummary', {title: 'monthly information', monthlydata2: data2.rows, monthlydata: data.rows });

    });

	});
});

module.exports = router;
