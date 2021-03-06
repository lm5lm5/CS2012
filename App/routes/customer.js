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
var sql_query = 'SELECT Cid FROM customerLogin WHERE Username = \'';
var sql_query2 = '\' AND password = \'';

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.user && sess.user != null) {
		console.log("here?")
		res.redirect("/customerProfile");
	}
	else {
		console.log("Wha why?")
		var errorcheck = sess.error;
		var errortypecheck = sess.errortype
		if (errorcheck && errorcheck != null && errortypecheck == 'cidexist') {
			console.log("HEREERERERE");

			sess.error = null;
			sess.errortype = null;

			res.render('customer', { title: 'Customer login', error: errorcheck });

		}
		else {
			res.render('customer', { title: 'Customer login', error: null });
		}
	}
	//req.session.destroy();
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var username = req.body.username;
	var password = req.body.password;

	// Construct Specific SQL Query
	var insert_query = sql_query + username + sql_query2 + password + '\'';
	console.log(insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'cidexist';
			res.redirect('/customer');
		}
		else {
			console.log(data.length);
			console.log(data.rows);
			console.log(data.rowCount);
			if (data.rowCount == 1) {
				sess = req.session;
				sess.login = 1;
				sess.customer = 1;
				sess.error = null;
				var data = data.rows;
				sess.user = data[0].cid;
				sess.pw = data[0].password;
				res.redirect('/customerProfile')
			}
			else {
				sess = req.session;
				sess.error = "Username or password wrong";
				sess.errortype = 'cidexist';
				res.redirect('/customer');

			}
		}

	});
});

module.exports = router;
