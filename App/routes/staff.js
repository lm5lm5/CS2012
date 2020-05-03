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
var sql_query = 'SELECT restaurant_name, Username FROM staffLogin WHERE Username = \'';
var sql_query2 = '\' AND password = \'';
var sql_query3 = '\' AND Restaurant_name = \'';

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'staffidexist') {
		console.log("HEREERERERE");
		res.render('staff', { title: 'Get staffid', error: sess.error});
		sess.error = null;
		sess.errortype = 'staffidexist';
	}
	else {
		res.render('staff', { title: 'Get staffid', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var username = req.body.username;
	var password = req.body.password;
	var Restaurant_name = req.body.Restaurant_name;

	// Construct Specific SQL Query
	var insert_query = sql_query + username + sql_query2 + password + sql_query3 + Restaurant_name + '\'';
	console.log(insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'staffidexist';
			res.redirect('/staff');
		}
		else {
			console.log("insert_query: " + insert_query);
			console.log("data.length: " + data.length);
			console.log("data.rows: " + data.rows);
			console.log("data.rowcount: " + data.rowCount);
			if (data.rowCount == 1){
				sess = req.session;
				sess.login = 1;
				sess.staff = 1;
				sess.error = null;
				var data = data.rows;
				sess.rname = data[0].restaurant_name;
				sess.staffname = data[0].username;

				// sess.user = data[0].staffid;
				// sess.user = data[0].staffid;
				console.log("data[0].Restaurant_name: " + sess.rname);
				console.log("data[0].username: " + sess.staffname);
				res.redirect('/restaurantProfile')
			}
			else {
				sess = req.session;
				sess.error = "Resturant name or Username or password wrong";
				sess.errortype = 'staffidexist';
				res.redirect('/staff');
				
			}
		}

	});
});

module.exports = router;
