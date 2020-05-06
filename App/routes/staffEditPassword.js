// var express = require('express');
// var router = express.Router();

// const { Pool } = require('pg')
// /* --- V7: Using Dot Env ---
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: '********',
//   port: 5432,
// })
// */
// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL
// });

// /* SQL Query */
// var sql_query = 'update stafflogin set password = \'';
// var sql_query2 = ' where staffid = ';
// var sql_query3 = 'select * from stafflogin where staffid = ';
// var sql_query4 = ' and password = \'';

// // GET  
// router.get('/', function (req, res, next) {
// 	sess = req.session;
// 	sess.changepwsuccess = 0;
// 	console.log('LOL is ' + sess.id);
// 	if (sess.login != 1) {
// 		res.redirect('/staff');
// 	}

// 	else if (sess.login == 1 && sess.staff != 1) {
// 		res.redirect('/staff');
// 	}
// 	else {
// 		res.render('staffEditPassword', { title: 'Modifying Database', error: null });
// 	}
// });

// // POST
// router.post('/', function (req, res, next) {
// 	// Retrieve Information
// 	sess = req.session;
// 	sess.changepwsuccess = 0;
// 	var password = req.body.password;
// 	var previouspw = req.body.previouspw;
// 	// Construct Specific SQL Query
// 	var update_query = sql_query + password + '\'' + sql_query2 + sess.user;
// 	var check_password = sql_query3 + sess.user + sql_query4 + previouspw + '\'';
// 	pool.query(check_password, (err, data) => {
// 		if (err) {
// 			console.log(err.stack);
// 			sess = req.session;
// 			var errormessage = err.stack;
// 			sess.error = errormessage;
// 			res.redirect('/staffEditPassword');
// 		} else {
// 			console.log("check pw querry = " + check_password);
// 			sess.numrows = data.rowCount;
// 			console.log("sess.numrows = " + sess.numrows);
// 			if (sess.numrows == 0) {
// 				res.redirect('/staffEditPassword');
// 			} else {
// 				pool.query(update_query, (err, data2) => {
// 					if (err) {
// 						console.log(err.stack);
// 						sess = req.session;
// 						var errormessage = err.stack;
// 						sess.error = errormessage;
// 						res.redirect('/staffEditPassword');
// 					} else {
// 						console.log("update query = " + update_query);
// 						sess.numrows = -1;
// 						sess.changepwsuccess = 1;
// 						res.redirect('/restaurantProfile');
// 					}
// 				});
// 			}
// 		}
// 	});
// });



// module.exports = router;
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
var sql_query = 'update stafflogin set password = \'';
var sql_query2 = ' where staffid = ';
var sql_query3 = 'select * from stafflogin where staffid = ';
var sql_query4 = ' and password = \'';

// GET  
router.get('/', function (req, res, next) {
	sess = req.session;
	sess.changepwsuccess = 0;
	console.log('sess.changepwsuccess: ' + sess.changepwsuccess);
	console.log('sess.rname: ' + sess.rname);
	console.log('sess.restaurant_name :' + sess.restaurant_name);
	console.log('sess.password :' + sess.password);
	console.log('sess.username :' + sess.username);
	console.log('sess.staffid :' + sess.staffid);
	console.log('LOL is ' + sess.id);
	if (sess.login != 1) {
		res.redirect('/staff');
	}

	else if (sess.login == 1 && sess.staff != 1) {
		res.redirect('/staff');
	}
	else {
		res.render('staffEditPassword', { title: 'Modifying Database', error: null });
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
			res.redirect('/staffEditPassword');
		} else {
			console.log("check pw querry = " + check_password);
			sess.numrows = data.rowCount;
			console.log("sess.numrows = " + sess.numrows);
			if (sess.numrows == 0) {
				res.redirect('/staffEditPassword');
			} else {
				pool.query(update_query, (err, data2) => {
					if (err) {
						console.log(err.stack);
						sess = req.session;
						var errormessage = err.stack;
						sess.error = errormessage;
						res.redirect('/staffEditPassword');
					} else {
						console.log("update query = " + update_query);
						sess.numrows = -1;
						sess.changepwsuccess = 1;
						res.redirect('/restaurantProfile');
					}
				});
			}
		}
	});
});

module.exports = router;
