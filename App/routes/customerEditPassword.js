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
var sql_query = 'update customerlogin set password = \'';
var sql_query2 = ' where cid = ';
var sql_query3 = 'select * from customerLogin where cid = ';
var sql_query4 = ' and password = \'';
// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	sess.changepwsuccess = 0;
	console.log('LOL is ' + sess.id);
	if (sess.login != 1) {
		res.redirect('/customer');
	}

	else if (sess.login == 1 && sess.customer != 1) {
		res.redirect('/customer');
	}
	else {
		res.render('customerEditPassword', { title: 'Modifying Database', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	sess = req.session;
	sess.changepwsuccess = 0;
	var password = req.body.password;
	var previouspw = req.body.previouspw;
	// Construct Specific SQL Query
	var update_query = sql_query + password + '\'' + sql_query2 + sess.user;
	var check_password = sql_query3 + sess.user + sql_query4 + previouspw + '\'';
	pool.query(check_password, (err, data) => {
		if (err) {
			console.log(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			res.redirect('/customerEditPassword');
		} else {
			console.log("check pw querry = " + check_password);
			sess.numrows = data.rowCount;
			console.log("sess.numrows = " + sess.numrows);
			if (sess.numrows == 0) {
				res.redirect('/customerEditPassword');
			} else {
				pool.query(update_query, (err, data2) => {
					if (err) {
						console.log(err.stack);
						sess = req.session;
						var errormessage = err.stack;
						sess.error = errormessage;
						res.redirect('/customerEditPassword');
					} else {
						console.log("update query = " + update_query);
						sess.numrows = -1;
						sess.changepwsuccess = 1;
						res.redirect('/customerProfile');
					}
				});
			}
		}
	});
});

module.exports = router;
