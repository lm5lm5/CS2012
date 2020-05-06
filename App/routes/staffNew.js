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
var sql_query = `CREATE or REPLACE procedure addstaff ( restaurantthing text, usernamething text, passwordthing text)
AS $$

declare
    maxInt integer;
    usernamecheck text;
begin

SELECT username into usernamecheck
FROM staffLogin
WHERE username = usernamething;

if usernamecheck IS NOT NULL then
    raise exception 'This username is taken. Choose another username!';
end if;

select max(staffid) into maxInt from staffLogin;
insert into staffLogin (username, password, Restaurant_name, staffid) values (usernamething, passwordthing, restaurantthing, maxInt+1);

end
$$ language plpgsql;

call addstaff(`;

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'usernamewrong') {
		console.log("HEREERERERE");
		res.render('staffNew', { title: 'Add new staff', error: sess.error});
		sess.error = null;
	}
	else {
		res.render('staffNew', { title: 'Add new staff', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	// var ccNo = req.body.ccNo;
	var username = req.body.username;
	var password = req.body.password;
	var restaurant = req.body.restaurant;
	

	// Construct Specific SQL Query
	// 	var insert_query = sql_query + ccNo + ', \'' + username + '\', \'' + password + '\')';
	// var insert_query = sql_query + restaurant + '\'' + username + '\', \'' + password + '\')';
	var insert_query = sql_query + '\'' + restaurant + '\', \'' + username + '\', \'' + password + '\')';

	console.log(insert_query);

	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			// alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'usernamewrong';
			res.redirect('/staffNew');
		}
		else {
			sess = req.session;
			sess.login = 1;
			sess.staff = 1;
			sess.error = null;
			var sql_query = 'SELECT staffid FROM staffLogin WHERE Username = \'';
			insert_query = sql_query + username + '\'';
			var data23;
			pool.query(insert_query, (err, data2) => {
				var data3 = data2.rows;
				data23 = data3[0].staffid;
				req.session.user = data23;
				console.log(req.session.user);
				res.redirect('/');
			});
		}
	});
});

module.exports = router;
