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
var sql_query = 'with y as (with X as (select distinct f.flId, f.restaurant_name, f.order_time, f.total_cost as beforePromo_cost, f.promoid, c.reward_pts, (select p.discount from promotions p where f.promoid = p.promoid), c.cid from foodlists f join customer c on f.cid=c.cid order by restaurant_name) select cid, fname, price, rname, order_time, flid, count(*) from (x natural join consists c) join foods using (fname,rname) group by cid,fname,price,rname,order_time, flid) select * from y where cid = ';

var sql_query2 = 'select * from customer where cid = ';

router.get('/', function (req, res, next) {
  sess = req.session;
  var sql_query3 = sql_query + sess.user;
  var sql_query4 = sql_query2 + sess.user;
  console.log("myquery " + sql_query3);
  if(sess.user == 'undefined' || sess.user == null) {
    res.redirect('/customer');
  } else {
  pool.query(sql_query3, (err, data1) => {
    pool.query(sql_query4, (err, data2) => {
      res.render('customerProfile', { title: 'Database Connect', customerOrderData: data1.rows, customerPersonalData: data2.rows  });
    });
  });
}
  //req.session.destroy();
});

router.post('/', function (req, res, next) {
	// Retrieve Information
  req.session.destroy();
  res.redirect('/customer');
});

module.exports = router;
