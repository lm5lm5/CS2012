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
var sql2_query = 'with y as (with x as(with f as (select * from foodlists where promoid is not null) select distinct f.flId, f.restaurant_name, f.order_time, f.promoid, (select p.startDate from promotions p where f.promoid = p.promoid), (select p.endDate from promotions p where f.promoid = p.promoid) from f join customer c on f.cid=c.cid order by restaurant_name) select startdate, enddate, x.promoid from x where x.restaurant_name = \'';
var sql2_query1 = 'select promoid, startdate, enddate, count(*), enddate - startdate durationindays, (count(*)::decimal/(enddate - startdate))::decimal ratio from y group by promoid, startdate, enddate order by startdate'

router.get('/', function (req, res, next) {
  sess = req.session;

  console.log("rname: " + sess.rname);

  var sql2_query2 =  sql2_query + sess.rname + '\')' + sql2_query1;



  console.log("print sql2: " + sql2_query2);

    pool.query(sql2_query2, (err, data) => {
    //   function formatFunction(date){
    //     // 01, 02, 03, ... 29, 30, 31
    //     var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    //     // 01, 02, 03, ... 10, 11, 12
    //     var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    //     // 1970, 1971, ... 2015, 2016, ...
    //     var yyyy = date.getFullYear();
     
    //     // create the format you want
    //     return (yyyy + "-" + MM + "-" + dd);
    //  }

      // var original1 = data.rows[0].startdate;
      // var format1 = formatFunction(original1);
      // console.log("original1: " + original1);
      // console.log("format1: " + format1);
      // res.render('printPromotionSummary', {title: 'Promotions information', promotiondata: data.rows, promotiondata2: data2.rows });
		res.render('printPromotionSummary', {promotiondata: data.rows});

	});
});

module.exports = router;
