var express = require('express');
var router = express.Router();
//todo
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: 'wuwenfa',
  port: 5432,
})
 
/* SQL Query */
//todo 
var sql_query = 'insert into Restaurants (rname, promoid, minimalCost) values';

// GET
// router.get('/', function(req, res, next) {
// 	res.render('insert_restaurants', { title: 'add a new restaurant' });
// });

var sql_query = `CREATE or REPLACE procedure changePromotion (rnamething text, promotionthing Integer, minimalCostthing Integer)
AS $$

declare
    maxInt integer;
    usernamecheck text;
begin

SELECT username into usernamecheck
FROM restaurants
WHERE username = rnamething;

if usernamecheck IS NULL then
    raise exception 'This restaurant is not existing!';
end if;

set constraints restaurant_fkey deferred;
update restaurants set promoid = promotionthing where rname = rnamething;
update restaurants set minimalcost = minimalCostthing where rname = rnamething;

end
$$ language plpgsql;

call changePromotion(`;

router.get('/', function (req, res, next) {
	sess = req.session
	console.log('LOL is ' + sess.id);
	if (sess.error && sess.error != null) {
		console.log("HEREERERERE");
		res.render('insert_restaurants', { title: 'add a new restaurant', error: sess.error});
	}
	else if (sess.login != 1) {
		res.redirect('/');
	}

	else if (sess.login == 1 && sess.customer != 1) {
		res.redirect('/');
	}
	else {
		res.render('insert_restaurants', { title: 'add a new restaurant', error: null });
	}
});


// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var rname  = req.body.rname;
	var promoid    = req.body.promoid;
	var minimalCost = req.body.minimalCost;
	// var rname = req.body.rname;
	
	// Construct Specific SQL Query
	// var insert_query = sql_query + "('" + matric + "','" + name + "','" + faculty + "')";

	var insert_query = sql_query + "('" + rname + "','" + promoid + "','" + minimalCost + "')";
	
	// pool.query(insert_query, (err, data) => {
	// 	res.redirect('/insert')
	// }
	
	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			res.redirect('/insert_restaurants')
		}
		else {
			sess = req.session;
			sess.error = null;
			res.redirect('/select')
		}

	});
});

module.exports = router;
