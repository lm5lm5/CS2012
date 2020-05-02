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
var sql_query = 'INSERT INTO consists (coid, flid, fname, rname) VALUES';

// GET
router.get('/', function (req, res, next) {
	sess = req.session
	console.log('LOL is ' + sess.id);
	if (sess.error && sess.error != null) {
		console.log("HEREERERERE");
		res.render('insert', { title: 'Modifying Database', error: sess.error});
	}
	else if (sess.login != 1) {
		res.redirect('/');
	}

	else if (sess.login == 1 && sess.customer != 1) {
		res.redirect('/');
	}
	else {
		res.render('insert', { title: 'Modifying Database', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var matric = req.body.matric;
	var name = req.body.name;
	var faculty = req.body.faculty;

	// Construct Specific SQL Query
	var insert_query = sql_query + "(1, " + matric + ",'" + name + "','" + faculty + "')";


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			res.redirect('/insert')
		}
		else {
			sess = req.session;
			sess.error = null;
			res.redirect('/select')
		}

	});
});

module.exports = router;
