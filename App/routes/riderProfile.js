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
var sql_query = 'SELECT ridername FROM riders WHERE riderid= ';
sql_query =
router.get('/', function (req, res, next) {
  sess = req.session;
  sess.error = null;
  console.log("riderprofile's sess.user" +sess.user);
  console.log("riderprofile's sess.name" +sess.name);
  res.render('riderProfile');
});

module.exports = router;
