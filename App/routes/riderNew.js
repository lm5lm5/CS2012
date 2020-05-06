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
var sql_query = `CREATE or REPLACE procedure addRider (name text, usernamething text, passwordthing text)
AS $$

declare
    maxInt integer;
    usernamecheck text;
begin

SELECT username into usernamecheck
FROM riderLogin
WHERE username = usernamething;

if usernamecheck IS NOT NULL then
    raise exception 'This username is taken. Choose another username!';
end if;

select max(riderid) into maxInt from riders;
insert into riders (riderid, ridername) values (maxInt+1, name);
insert into parttimeriders (riderid, weeklybasesalary) values (maxInt+1, floor(random()*(999))+1);
insert into riderlogin (username, password, riderid) values (usernamething,passwordthing,maxInt+1);

end
$$ language plpgsql;

call addRider(`;

var sql_query2 = `CREATE or REPLACE procedure addRider (name text, usernamething text, passwordthing text)
AS $$

declare
    maxInt integer;
    usernamecheck text;
begin

SELECT username into usernamecheck
FROM riderLogin
WHERE username = usernamething;

if usernamecheck IS NOT NULL then
    raise exception 'This username is taken. Choose another username!';
end if;

select max(riderid) into maxInt from riders;
insert into riders (riderid, ridername) values (maxInt+1, name);
insert into fulltimeriders (riderid, mwsid, monthlybasesalary) values (maxInt+1, floor(random()*(15))+1,floor(random()*(999))+1);
insert into riderlogin (username, password, riderid) values (usernamething,passwordthing,maxInt+1);

end
$$ language plpgsql;

call addRider(`;

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'usernamewrong') {
		console.log("HEREERERERE");
		res.render('riderNew', { title: 'Add new rider', error: sess.error});
		sess.error = null;
	}
	else {
		res.render('riderNew', { title: 'Add new rider', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var type = req.body.group1;
	console.log(type);
	var insert_query;
	// Construct Specific SQL Query
	if(type == 'parttime') {
		insert_query = sql_query + '\'' + name + '\', \'' + username + '\', \'' + password + '\')';
	} else {
		insert_query = sql_query2 + '\'' + name + '\', \'' + username + '\', \'' + password + '\')';
	}
	console.log(insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = "pls choose a different username";
			sess.error = errormessage;
			sess.errortype = 'usernamewrong';
			res.redirect('/riderNew');
		}
		else {
			sess = req.session;
			sess.login = 1;
			sess.error = null;
			var sql_query = 'SELECT riderid FROM riderLogin WHERE Username = \'';
			insert_query = sql_query + username + '\'';
			var data23;
			pool.query(insert_query, (err, data2) => {
				var data3 = data2.rows;
				data23 = data3[0].riderid;
				req.session.user = data23;
				console.log(req.session.user);
				console.log("created new user");
				res.redirect('/rider');
			});
			
		}

	});
});

module.exports = router;
