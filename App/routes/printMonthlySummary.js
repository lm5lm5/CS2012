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

router.get('/', function (req, res, next) {
  sess = req.session;
  var sql_query4 = sql_query + sess.rname + sql_query2 + '2020-01-31' + sql_query1 + '2020-01-01' + '\'';

  console.log("print sql: " + sql_query4);
  pool.query(sql_query4, (err, data) => {
		res.render('monthlySummary', {monthlydata: data.rows });
	});
});

module.exports = router;
