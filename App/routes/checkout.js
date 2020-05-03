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
	var originalcost = req.body.originalcost;
	var deliveryfee = req.body.deliveryfeething;
	console.log("Payment option is " + payment);



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
	call newlocation ('`
	var sql_insertlocation2 = sql_insertlocation + deliverylocation + `', ` + sess.user + `);`;

	var datecurrent = new Date();

	// current date
	// adjust 0 before single digit date
	var day = ("0" + datecurrent.getDate()).slice(-2);

	// current month
	var month = ("0" + (datecurrent.getMonth() + 1)).slice(-2);

	// current year
	var year = datecurrent.getFullYear();

	// current hours
	var hours = datecurrent.getHours();

	// current minutes
	var minutes = datecurrent.getMinutes();

	// current seconds
	var seconds = datecurrent.getSeconds();

	var fulldate = `'` + year + "-" + month + "-" + day + `'`;

	const fulldate_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var rideridthing = Math.floor(
		Math.random() * (301 - 0) + 0
	)

	var insertdeliversql = `CREATE or replace procedure newdid(deliverything numeric, date1 timestamp, date2 timestamp, date3 timestamp, date4 timestamp, date5 timestamp, rideridthing integer, flidthing integer)
	AS $$
	
	declare
		didthing integer;
	
	begin
	
	SELECT (coalesce(max(did), 0)+1) into didthing FROM Delivers;

	insert into Delivers (did, deliveryfee, customerplaceorder, ridergotorest, rideratrest, riderleftrest, riderdeliverorder, riderid, rating) values (didthing, deliverything, date1, date2, date3, date4, date5, rideridthing, null); 

	Update foodlists SET did = didthing WHERE flid = flidthing;

	end
	$$ language plpgsql;
	call newdid(`

	var dategr = new Date();
	dategr.setMinutes(dategr.getMinutes() + 10);
	console.log("LOLOL WTD IS " + dategr);
	// adjust 0 before single digit date
	var day = ("0" + dategr.getDate()).slice(-2);
	// current month
	var month = ("0" + (dategr.getMonth() + 1)).slice(-2);
	// current year
	var year = dategr.getFullYear();
	// current hours
	var hours = dategr.getHours();
	// current minutes
	var minutes = dategr.getMinutes();
	// current seconds
	var seconds = dategr.getSeconds();
	const fulldategr_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var datear = dategr;
	datear.setHours(datear.getHours() + 1);
	// adjust 0 before single digit date
	var day = ("0" + datear.getDate()).slice(-2);
	// current month
	var month = ("0" + (datear.getMonth() + 1)).slice(-2);
	// current year
	var year = datear.getFullYear();
	// current hours
	var hours = datear.getHours();
	// current minutes
	var minutes = datear.getMinutes();
	// current seconds
	var seconds = datear.getSeconds();
	const fulldatear_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var datelr = datear;
	datelr.setMinutes(datelr.getMinutes() + 20);
	// adjust 0 before single digit date
	var day = ("0" + datelr.getDate()).slice(-2);
	// current month
	var month = ("0" + (datelr.getMonth() + 1)).slice(-2);
	// current year
	var year = datelr.getFullYear();
	// current hours
	var hours = datelr.getHours();
	// current minutes
	var minutes = datelr.getMinutes();
	// current seconds
	var seconds = datelr.getSeconds();
	const fulldatelr_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var datedo = datelr;
	datedo.setHours(datedo.getHours() + 2);
	// adjust 0 before single digit date
	var day = ("0" + datedo.getDate()).slice(-2);
	// current month
	var month = ("0" + (datedo.getMonth() + 1)).slice(-2);
	// current year
	var year = datedo.getFullYear();
	// current hours
	var hours = datedo.getHours();
	// current minutes
	var minutes = datedo.getMinutes();
	// current seconds
	var seconds = datedo.getSeconds();
	const fulldatedo_withtime = `'` + year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + `'`;

	var rewardptsused = req.body.rewardptsused;

	// var updatefoodlist_sql = `Update foodlist
	// SET payment_method = '`+ payment  + `', delivery_location = '` + deliverylocation + `', order_time = ` + fulldate + `, total_cost =` + costthing + `, did = ` + did

	var update_rewartpts_sql = `Update customer
	Set reward_pts = reward_pts - ` + rewardptsused +
		` WHERE cid = ` + sess.user + `;`;

	var update_rewartpts_sql_add = `Update customer Set reward_pts = reward_pts+ ` + Math.floor(originalcost / 500) + ` WHERE cid = ` + sess.user + `;`;

	var promoidthing = null;
	if (req.body.resdiscount > 0) {
		promoidthing = req.body.promoid;
	}

	var food_list_update = `Update foodlists SET riderid = ` + rideridthing + `, promoid = ` + promoidthing + `, order_time = ` + fulldate + `, payment_method = '` + payment + `', total_cost = ` + originalcost + `, delivery_location = '` + deliverylocation + `' WHERE flid = ` + sess.flid + `;`;



	var full_sql_thing = insertdeliversql + deliveryfee + `, ` + fulldate_withtime + `, ` + fulldategr_withtime + `, ` + fulldatear_withtime + `, ` + fulldatelr_withtime + `, ` + fulldatedo_withtime + `, ` + rideridthing + `, ` + sess.flid + `);` + sql_insertlocation2 + update_rewartpts_sql + update_rewartpts_sql_add + food_list_update;

	console.log (full_sql_thing);










	pool.query(full_sql_thing, (err, data2) => {

		req.session.error = null;
		req.session.errortype = null;
		req.session.flid = null;
		req.session.chosenFood = null;
		req.session.rname = null;
		
		res.redirect("/");






	});
});

module.exports = router;
