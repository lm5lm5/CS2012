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

// /* SQL Query */
// var sql_query = 'with commontable as (with X as (select distinct f.flId, f.restaurant_name, f.order_time, f.total_cost as beforePromo_cost, f.promoid, c.reward_pts, (select p.discount from promotions p where f.promoid = p.promoid) from foodlists f join customer c on f.cid=c.cid order by restaurant_name) select flid, restaurant_name, order_time, beforePromo_cost, (beforePromo_cost - reward_pts) / 100 * (100 - discount) as afterPromo_cost from X) select count(*) as total_orders, sum(afterPromo_cost) as total_cost from commontable where restaurant_name = \''
// var sql_query1 = '\'' + ' and order_time >' + '\''; 
// var sql_query2 = '\'' + ' and order_time <' + '\'';

// GET
// res.render('monthlySummary', { title: 'view monthly summary', error: null });

router.get('/', function (req, res, next) {
	sess = req.session;
  res.render('monthlySummary', { title: 'view monthly summary', error: null });
});

// POST
router.post('/', function (req, res, next) {
    // Retrieve Informatio
    sess = req.session;
    var month = req.body.month;
    var year = req.body.year;
    sess.month = month;
    sess.year = year;
    console.log("print month: " + month);
    console.log("print year: " + year);
    
      res.redirect('/printMonthlySummary');
});

module.exports = router;