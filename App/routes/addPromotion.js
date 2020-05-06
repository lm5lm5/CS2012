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


// insert into promotions (promoid, descriptionpromo, discount, startdate, enddate) values (101, '111-90-7590', 79.3, '2020-03-03', '2019-07-07');
/* SQL Query */
// var sql_query = `CREATE or REPLACE procedure addPromotion (fnamething text, rname text, dailylimitthing Integer, isavailablething boolean, categorything text, pricething decimal)
var sql_query = `CREATE or REPLACE procedure addPromotion (restaruantname text, description text, discountthing decimal, starting date, ending date)
AS $$

declare
    maxInt int;
begin

select max(promoid) into maxInt from promotions;

set constraints restaurant_fkey deferred;
update restaurants set promoid = maxInt+1 where rname = restaruantname;
insert into promotions (promoid, descriptionpromo, discount, startdate, enddate) values (maxInt+1, description, discountthing, starting, ending);

end
$$ language plpgsql;

call addPromotion(`;
// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.error && sess.error != null && sess.errortype == 'usernamewrong') {
		console.log("HEREERERERE");
		res.render('addPromotion', { title: 'Add a new promotion', error: sess.error});
		sess.error = null;
	}
	else {
		res.render('addPromotion', { title: 'Add a new promotion', error: null });
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	console.log("------------------------------------------------------------------");

	var descriptionpromo = req.body.descriptionpromo;
  var discount = req.body.discount;
  var startdate = req.body.startdate;
  var enddate = req.body.enddate;

  function endAfterStart(start,end){
	return new Date(start.split('/').reverse().join('/')) <
			new Date(end.split('/').reverse().join('/'));
  }
//   alert(endAfterStart(startdate,enddate)); //=> true

// consile.log("check start and end: " + endAfterStart(startdate,enddate));


//   var price = req.body.price;
  var restaruantname = sess.rname;

  // Construct Specific SQL Query
  // fname, rname, dailylimit, isavailable, category, price
  // var insert_query = sql_query + '\'' + ccNo + '\', \'' + username + '\', \'' + password + '\')';
  console.log("restaurantName: " + restaruantname);
	var insert_query = sql_query + '\'' + restaruantname + '\'' +  ', \'' + descriptionpromo + '\', ' + discount + ', \'' + startdate + '\'' + ', \'' + enddate + '\'' +  ')';
	console.log("insert_query: " + insert_query);


	pool.query(insert_query, (err, data) => {
		if (err) {
			console.log(err.stack);
			//alert(err.stack);
			sess = req.session;
			var errormessage = err.stack;
			sess.error = errormessage;
			sess.errortype = 'promotionwrong';
			res.redirect('/addPromotion');
		}
		else {
      res.redirect('/restaurantProfile');
			
		}

	});
});

module.exports = router;
