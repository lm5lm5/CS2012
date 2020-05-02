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
var sql_query = `WITH tmp AS (
  SELECT * FROM customer LEFT JOIN foodlists USING (cid) LEFT JOIN consists USING (flid) LEFT JOIN foods USING (fname)),
  
  tmp2 AS (
  SELECT coalesce(SUM(price),0) AS totalprice, flid, cid FROM tmp GROUP BY flid,cid )
  
  SELECT *
  FROM tmp JOIN tmp2 USING (cid)
  WHERE cid = `;

var sql_query2 = 

router.get('/', function(req, res, next) {
  var total_query = sql_query + req.session.user;
  var data1;
  
	pool.query(total_query, (err, data) => {
		data1 = data;
  });

  pool.query(total)
  
  res.render('customerProfile', { title: 'All your information', data: data1.rows});
});

module.exports = router;
