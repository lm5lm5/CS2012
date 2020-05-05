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
var sql_query = 'with y as (with x as (select sum(price), flid from (foodlists join consists using (flid)) join foods using (fname,rname) group by flid order by flid) select cid, flid, fname, rname, price, order_time, sum, count(*) from ((foodlists join consists using (flid)) join foods using (fname,rname)) join x using (flid) group by cid ,flid, fname, rname, price, order_time, sum) select * from y where cid = ';

 

router.get('/', function(req, res, next) {
		res.render('foodList', { title: 'Database Connect', foodListData: data.rows });
});

router.post('/', function (req, res, next) {
	// Retrieve Information
  //req.session.destroy();
  sess = req.session;
  var select_query = sql_query + sess.user + ' and flid = ' + req.body.flid;
  console.log("select_query = " + select_query);
  pool.query(select_query, (err, data) => {
		res.render('foodList', { title: 'Database Connect', foodListData: data.rows });
	});
});

module.exports = router;
