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
var sql_query = 'select did, deliveryfee, customerplaceorder, ridergotorest, rideratrest, riderleftrest, riderdeliverorder, rating from delivers d where d.riderid = ';
router.get('/', function (req, res, next) {
  sess = req.session;
  console.log("sess.user is = " + sess.user);
  var sql_query2 = sql_query + sess.user;
  console.log("myquery2 " + sql_query2);
  pool.query(sql_query2, (err, data) => {
		res.render('riderPastDeliveries', {deliverydata: data.rows });
	});
});

module.exports = router;
