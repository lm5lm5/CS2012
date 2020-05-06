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
var sql_query = `SELECT DISTINCT username, review
FROM FOODs LEFT JOIN consists using (fname,rname) left join foodlists using (flid) left join reviews using (flid) left join customer using (cid) left join customerlogin using (cid)
WHERE reviews IS NOT NULL
AND fname = '`;

router.get('/', function(req, res, next) {
  
  var fname = req.query.fname;
  var rname = req.query.rname;

  var full_sql_review = sql_query + fname + `' AND rname = '` + rname + `';`

  console.log(full_sql_review);

  var newtitle = `Review for '` + fname + `' from the restuarant '` + rname + `'`; 
	pool.query(full_sql_review, (err, data) => {
		res.render('reviews', { title: newtitle, data: data.rows });
	});
});

module.exports = router;
