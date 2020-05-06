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


router.post('/', function (req, res, next) {
        // Retrieve Information
        var did = req.body.rateDid;
        var rating = req.body.group2;
        var update_query = 'update delivers set rating = ' + rating + ' where did = ' + did;
        
        pool.query(update_query, (err, deletething) => {
          
          res.redirect('/customerProfile');
        });
        //update delivers set rating = 1 where did = 1;
      });

module.exports = router;
