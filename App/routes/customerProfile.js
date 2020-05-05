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
var sql_query = 'select * from foodlists where payment_method IS NOT NULL AND cid = ';

var sql_query2 = 'select * from customer where cid = ';

router.get('/', function (req, res, next) {
  sess = req.session;
  var sql_query3 = sql_query + sess.user;
  var sql_query4 = sql_query2 + sess.user;
  console.log("myquery " + sql_query3);
  if (sess.user == 'undefined' || sess.user == null) {
    res.redirect('/customer');
  } else {
    pool.query(sql_query3, (err, data1) => {
      pool.query(sql_query4, (err, data2) => {
        res.render('customerProfile', { title: 'Database Connect', customerOrderData: data1.rows, customerPersonalData: data2.rows });
      });
    });
  }
  //req.session.destroy();
});

router.post('/', function (req, res, next) {
  // Retrieve Information
  var easydelete = `
		With t as (
			SELECT coalesce(count(*),0) AS no, fname, rname FROM foodlists JOIN consists USING (flid) WHERE payment_method IS NULL GROUP BY fname,rname
			)
			Update foods
			SET dailylimit = dailylimit + t.no
			FROM t
			WHERE foods.fname = t.fname
			AND foods.rname = t.rname;
		
		DELETE FROM foodlists WHERE payment_method IS NULL;`;

  pool.query(easydelete, (err, deletething) => {
    req.session.destroy();
    res.redirect('/customer');
  });

});

module.exports = router;
