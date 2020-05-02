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
var sql_query = 'insert into Restaurants (rname, promoid) values';

// GET
router.get('/', function(req, res, next) {
	res.render('insert_restaurants', { title: 'Modifying Database' });
});

// POST
router.post('/', function(req, res, next) {
	// Retrieve Information
	var rname  = req.body.rname;
	var promoid    = req.body.promoid;
	// var fname = req.body.fname;
	// var rname = req.body.rname;
	
	// Construct Specific SQL Query
	// var insert_query = sql_query + "('" + matric + "','" + name + "','" + faculty + "')";

	var insert_query = sql_query + "('" + rname + "','" + promoid + "')";
	
	pool.query(insert_query, (err, data) => {
		res.redirect('/select')
	});
});

module.exports = router;
