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
var sql_query = 'SELECT riderid, ridername FROM riderlogin natural join riders WHERE username = \'';
var sql_query2 = '\' AND password = \'';

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'riderexist') {
		console.log("HEREERERERE");
		res.render('rider', { title: 'Rider login', error: sess.error});
		sess.error = null;
		sess.errortype = 'riderexist';
	}
	else {
		res.render('rider', { title: 'Rider login', error: null });
	}
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
			sess.errortype = 'riderexist';
			res.redirect('/rider');
		}
		else {
			console.log(data.length);
			console.log(data.rows);
			console.log(data.rowCount);
			if (data.rowCount == 1){
				sess = req.session;
				sess.login = 1;
				sess.error = null;
				var data = data.rows;
				sess.user = data[0].riderid;
				sess.name = data[0].ridername;
				console.log("dddddddd" + sess.user);
				console.log("addsadasdsa" + sess.name);
				res.redirect('/riderProfile')
			}
			else {
				sess = req.session;
				sess.error = "Username or password wrong";
				sess.errortype = 'riderexist';
				res.redirect('/rider');
			}
		}
	});
});

module.exports = router;
