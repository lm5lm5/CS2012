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
		var date2 = new Date();
		console.log("True time " + date2);

		var sql_checkout = `SELECT * FROM customer JOIN foodlists USING (cid) JOIN consists USING (flid) JOIN foods USING (fname,rname) JOIN food_categories using (category) JOIN  (restaurants JOIN promotions USING (promoid)) USING (rname) WHERE flid =`
		var sql_checkout_full = sql_checkout + sess.flid;
		var rewardpts = req.query.points;

		console.log(sql_checkout_full);

		pool.query(sql_checkout_full, (err, data2) => {
			var date3 = new Date(data2.rows[0].startdate)
			var date4 = new Date(data2.rows[0].enddate)
			console.log("NIggs time: " + date3);
			var noOfItems = data2.rowCount;
			var fee = noOfItems * 5;
			var resdiscount = 0;
			if (date2 > date3 && date2 < date4) {
				resdiscount = data2.rows[0].discount;
			}


			res.render('checkout', { title: 'Checkout', ownfoodlist: data2.rows, deliveryfee: fee, price: data2.rows[0].total_cost, rewardpts: rewardpts, resdiscount: resdiscount });
		});



	}
});

// POST
router.post('/', function (req, res, next) {
	// Retrieve Information
	sess = req.session;
	var deliverylocation = req.body.delivery;
	var payment = req.body.payment;
	var costthing = req.body.costthing3;
	var deliveryfee = req.body.deliveryfeething;



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
	call newlocation ('
	`
	var sql_insertlocation2 = sql_insertlocation + deliverylocation + `'` + sess.user + `);`;

	var datecurrent = new Date();

	// current date
	// adjust 0 before single digit date
	var day = ("0" + datecurrent.getDate()).slice(-2);

	// current month
	var month = ("0" + (datecurrent.getMonth() + 1)).slice(-2);

	// current year
	var year = datecurrent.getFullYear();

	// current hours
	let hours = datecurrent.getHours();

	// current minutes
	let minutes = datecurrent.getMinutes();

	// current seconds
	let seconds = datecurrent.getSeconds();

	var fulldate = `'` + year + "-" + month + "-" + day + `'`;

	var fulldate_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var rideridthing = Math.floor(
		Math.random() * (301 - 0) + 0
	)

	var insertdeliversql = `CREATE or replace procedure newdid(deliverything numeric, date1 text, date2 text, date3 text, date4 text, date5 text, rideridthing)
	AS $$
	
	declare
		didthing integer;
	
	begin
	
	SELECT (coalesce(max(did), 0)+1) into didthing FROM Delivers;

	insert into Delivers (did, deliveryfee, customerplaceorder, ridergotorest, rideratrest, riderleftrest, riderdeliverorder, riderid, rating) values (didthing, deliverything, date1, date2, date3, date4, date5, rideridthing, null); 
	end
	$$ language plpgsql;`








	pool.query(sql_checkout_full, (err, data2) => {
		var date3 = new Date(data2.rows[0].startdate)
		var date4 = new Date(data2.rows[0].enddate)
		console.log("NIggs time: " + date3);
		var noOfItems = data2.rowCount;
		var fee = noOfItems * 5;
		var resdiscount = 0;
		if (date2 > date3 && date2 < date4) {
			resdiscount = data2.rows[0].discount;
		}


		res.render('checkout', { title: 'Checkout', ownfoodlist: data2.rows, deliveryfee: fee, price: data2.rows[0].total_cost, rewardpts: rewardpts, resdiscount: resdiscount });
	});

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
