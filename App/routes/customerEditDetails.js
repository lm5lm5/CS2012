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

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	console.log('LOL is ' + sess.id);
	if (sess.login != 1) {
		res.redirect('/customer');
	}

	else if (sess.login == 1 && sess.customer != 1) {
		res.redirect('/customer');
	}
	else {
		res.render('customerEditDetails', { title: 'Modifying Database', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	sess = req.session;
	var password = req.body.password;
	var previouspw = req.body.previouspw;
	// Construct Specific SQL Query
	var update_query = sql_query + password + '\'' + sql_query2 + sess.user;
	console.log(update_query);
	/*if(previouspw != sess.pw) {
		alert("Your previous password that you have entered is wrong");
		res.redirect('/customerEditDetails');
	}*/

	pool.query(update_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			res.redirect('/customerEditDetails');
		} 
		else {
			sess = req.session;
			sess.error = null;
			res.redirect('/customerProfile')
		}

	});
});

module.exports = router;
