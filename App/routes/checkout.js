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

// GET
router.get('/', function (req, res, next) {
	sess = req.session;
	if (sess.flid == null) {
		res.redirect('/orderFood');
	}
	else {
		var sql_checkout = `SELECT * FROM customer JOIN foodlists USING (cid) JOIN consists USING (flid) JOIN foods USING (fname) WHERE flid =`
		var sql_checkout_full = sql_checkout + sess.flid;


		pool.query(sql_checkout_full, (err, data2) => {
			res.render('checkout', { title: 'Checkout', ownfoodlist: data2.rows, total_cost: 0, price: data2.rows[0].total_cost });
		});


		
	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	var deliverylocation = req.body.delivery;
	var payment = req.body.payment;

	var sql_insertlocation = `CREATE or replace procedure newlocation (locationthing text, checkcid integer)
	AS $$
	
	declare
		firstlocthing text;
		secondlocthing text;
		thirdlocthing text;
		fourthlocthing text;
		fifthlocthing text;
	
	begin
	
	SELECT firstloc, secondloc, thirdloc, fourthloc, fifthloc
	INTO firstlocthing, secondlocthing, thirdlocthing, fourthlocthing, fifthlocthing
	FROM Customer
	WHERE cid = checkcid;
	
	if (locationthing IS DISTINCT FROM  firstlocthing AND locationthing IS DISTINCT FROM secondlocthing AND locationthing IS DISTINCT FROM thirdlocthing AND locationthing IS DISTINCT FROM fourthlocthing AND locationthing IS DISTINCT FROM fifthlocthing) then
		
		update Customer
		SET FirstLoc = (CASE WHEN No_of_loc = 0 then locationthing ELSE FirstLoc END),
		SecondLoc = (CASE WHEN No_of_loc = 1 then locationthing ELSE SecondLoc END),
		ThirdLoc = (CASE WHEN No_of_loc = 2 then locationthing ELSE ThirdLoc END),
		FourthLoc = (CASE WHEN No_of_loc = 3 then locationthing ELSE FourthLoc END),
		FifthLoc = (CASE WHEN No_of_loc = 4 then locationthing ELSE FifthLoc END)
		WHERE checkcid = Customer.cid;
	
		update Customer
		SET No_of_loc = (No_of_loc + 1) % 5
		WHERE checkcid = Customer.cid;
	
	end if;
	
	
	
	end
	$$ language plpgsql;
	`

	// Construct Specific SQL Query
	// var insert_query = sql_query + '\'' + ccNo + '\', \'' + username + '\', \'' + password + '\')';
	// console.log(insert_query);


	// pool.query(insert_query, (err, data) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 		//alert(err.stack);
	// 		sess = req.session;
	// 		var errormessage = err.stack;
	// 		sess.error = errormessage;
	// 		sess.errortype = 'usernamewrong';
	// 		res.redirect('/customerNew');
	// 	}
	// 	else {
	// 		sess = req.session;
	// 		sess.login = 1;
	// 		sess.customer = 1;
	// 		sess.error = null;
	// 		var sql_query = 'SELECT Cid FROM customerLogin WHERE Username = \'';
	// 		insert_query = sql_query + username + '\'';
	// 		var data23;
	// 		pool.query(insert_query, (err, data2) => {
	// 			var data3 = data2.rows;
	// 			data23 = data3[0].cid;
	// 			req.session.user = data23;
	// 			console.log(req.session.user);
	// 			res.redirect('/');
	// 		});
			
	// 	}

	// });
});

module.exports = router;
