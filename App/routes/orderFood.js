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
var sql_query = 'SELECT * FROM foods join food_categories using (category)';
var sql_ifchosen = ' WHERE rname =';
var sql_order = `Order by fname,rname;`
var sql_ifflid = 'SELECT * FROM customer join foodlists USING (cid) join consists USING (flid) JOIN foods USING (fname,rname) join food_categories using (category) join restaurants USING (rname) where flid =';


router.get('/', function (req, res, next) {
  sess = req.session;
  if (sess.flid == null) {

    if (sess.chosenFood == null) {
      console.log("HHEEEEE");
      sql_query2 = sql_query + sql_order;
      pool.query(sql_query2, (err, foodlist) => {
        res.render('orderFood', { title: 'Food list', foodlist: foodlist.rows, flidPresent: false });
      });
    }
    else {
      console.log("LLLLLAAAA")
      sql_final = sql_query + sql_ifchosen + '\'' + sess.rname + '\'' + sql_order;
      pool.query(sql_final, (err, foodlist) => {
        res.render('orderFood', { title: 'Food list', foodlist: foodlist.rows, flidPresent: false });
      });
    }


  }
  else {
    sql_finalflid = sql_ifflid + sess.flid + ';';
    console.log("REEE");
    pool.query(sql_finalflid, (err, ownfoodlist) => {
      if (ownfoodlist.rowCount == 0) {

        sess.flid = null;
        sess.chosenFood = null;
        sess.rname = null;
        sql_query2 = sql_query + sql_order;

        console.log(sql_query2);
        pool.query(sql_query2, (err, foodlist) => {
          res.render('orderFood', { title: 'Food list', foodlist: foodlist.rows, flidPresent: false });
        });

      }
      else {
        sess.ownfoodlist = ownfoodlist;
        sql_totalcost = 'SELECT sum(price) AS totalthing FROM foodlists join consists USING (flid) JOIN foods USING (fname,rname) join food_categories using (category) where flid =' + sess.flid + ';';

        console.log(sql_totalcost);
        pool.query(sql_totalcost, (err, ownfoodlistcost) => {

          if (sess.chosenFood == null) {
            var sql_query3 = sql_query + sql_order;

            console.log(sql_query3);
            pool.query(sql_query, (err, foodlist) => {

              var canbuy = false;
              if (ownfoodlistcost.rows[0].totalthing > ownfoodlist.rows[0].minimalcost) {
                canbuy = true;
              }
              res.render('orderFood', { title: 'Food list', foodlist: foodlist.rows, flidPresent: true, ownfoodlist: ownfoodlist.rows, totalcost: ownfoodlistcost.rows[0].totalthing, minimalcost1: ownfoodlist.rows[0].minimalcost, canbuy: canbuy});
            });
          }
          else {
            sql_final = sql_query + sql_ifchosen + '\'' + sess.rname + '\'' + sql_order;
            console.log(sql_final);
            pool.query(sql_final, (err, foodlist) => {

              var canbuy = false;
              if (ownfoodlistcost.rows[0].totalthing > ownfoodlist.rows[0].minimalcost) {
                canbuy = true;
              }
              res.render('orderFood', { title: 'Food list', foodlist: foodlist.rows, flidPresent: true, ownfoodlist: ownfoodlist.rows, totalcost: ownfoodlistcost.rows[0].totalthing, canbuy: canbuy, minimalcost1: ownfoodlist.rows[0].minimalcost });
            });
          }


        })
      }


    });

  }


});


router.post('/', function (req, res, next) {

  sess = req.session;
  if (sess.login != 1 && sess.customer != 1) {
    res.redirect('/customer');
  }

  if (req.body.action == "Add") {
   
    console.log(req.body.numbertobuy);


    var big_sql = `CREATE OR replace FUNCTION check_food_restuarant_constraint() RETURNS TRIGGER
  AS $$
  
  declare 
      rnamething varchar(100);
  
  Begin
  
  SELECT c.rname into rnamething
  FROM consists c
  WHERE c.flid = new.flid
  AND c.rname <> new.rname;
  
  if rnamething is not null then
      raise exception 'You added a food from this restuarant %. This restuarant is not the same as the other food restuarant in your foodlist!', new.rname;
  end if;
  return null;
  
  
  END
  
  $$ language plpgsql;
  
  Drop trigger if exists check_food_restuarant_trigger on consists;
  CREATE trigger check_food_restuarant_trigger
  AFTER INSERT OR UPDATE on consists
  For each row
  Execute FUNCTION check_food_restuarant_constraint();
  
  
  CREATE OR replace FUNCTION check_food_availability_constraint() RETURNS TRIGGER
  AS $$
  
  declare 
      availabilityCheck boolean;
  
  Begin
  
  SELECT f.isavailable into availabilityCheck
  FROM consists c, foods f
  WHERE new.fname = f.fname
  AND new.rname = f.rname
  AND c.coid = new.coid
  AND c.fname = f.fname;
  
  if availabilityCheck = FALSE then
      raise exception 'You added a non-available food %!', new.fname;
  end if;
  return null;
  
  
  END
  
  $$ language plpgsql;
  
  
  Drop trigger if exists check_food_availability_trigger on consists;
  CREATE trigger check_food_availability_trigger
  AFTER INSERT OR UPDATE on consists
  For each row
  Execute FUNCTION check_food_availability_constraint();
  
  
  CREATE or replace procedure addFood (flidthing integer, fnamething varchar(100), rnamething varchar(100), numberthing integer)
  AS $$
  
  declare
      costthing numeric;
      coidthing integer;
      leftover integer;
   
  begin
  
  FOR counter IN 1..numberthing LOOP
      Select (coalesce(max(coid), 0)+1) into coidthing
      from consists;
  
      insert into consists (coid, flid, fname, rname) values (coidthing, flidthing, fnamething, rnamething);
  
      Select price into costthing
      from foods
      where fname = fnamething
      and rname = rnamething;
  
      update foodlists
      set total_cost = total_cost + costthing
      where flid = flidthing;

      
  END LOOP;

  update foods
  set dailylimit = dailylimit - numberthing
  where fname = fnamething
  and rname = rnamething;

  SELECT dailylimit INTO leftover
  FROM foods
  where fname = fnamething
  and rname = rnamething;

  update foods
  set isavailable = false
  where fname = fnamething
  and rname = rnamething
  and dailylimit < 1;


  end
  
  $$ language plpgsql;
  `

    var insertfoodlist_sql = `insert into Foodlists (flid, cid, riderid, order_time, payment_method, total_cost, delivery_location, did) values (`;

    var calladdfood_sql = `call addFood(`

    if (sess.flid == null) {
      var newflid_sql = `SELECT (coalesce(max(flid), 0) + 1) AS newflid FROM foodlists;`;
      var newflid;
      pool.query(newflid_sql, (err, thatnewflid) => {
        newflid = thatnewflid.rows[0].newflid;
        sess.flid = newflid;
        var full_sql = big_sql + insertfoodlist_sql + newflid + ', ' + sess.user + `, null, null, null, 0, null, null);` + calladdfood_sql + newflid + `, '` + req.body.fname + `', '` + req.body.rname + `',` + req.body.numbertobuy + `);`;
        pool.query(full_sql, (err, thatnewflid) => {
          if (err) {
            console.log("ERROR is " + err);
            sess.flid = null;
          }
          else {
            sess.chosenFood = true;
            sess.rname = req.body.rname;
            res.redirect("/orderFood");


          }



        });



      });
    }

    else {
      var calladdfood_sql2 = `call addFood(`

      var full_sql = big_sql + calladdfood_sql2 + sess.flid + `, '` + req.body.fname + `', '` + req.body.rname + `',` + req.body.numbertobuy + `);`;
      pool.query(full_sql, (err, thatnewflid) => {
        if (err) {
          console.log("ERROR is " + err);
        }
        else {
          sess.chosenFood = true;
          sess.rname = req.body.rname;
          res.redirect("/orderFood");


        }



      });


    }

  }

  else if (req.body.action == "Delete") {

    sess = req.session;

    var sql_finddelete1 = `SELECT coalesce(max(coid), 0) AS coid FROM consists WHERE fname = '`
    var sql_finddelete2 = `' AND rname = '`
    var sql_finddelete3 = `' AND flid = `
    var sql_fullfindelete3 = sql_finddelete1 + req.body.fname + sql_finddelete2 + req.body.rname + sql_finddelete3 + sess.flid + `;`;

    console.log(sql_fullfindelete3);

    pool.query(sql_fullfindelete3, (err, coidDelete) => {
      if (err) {
        console.log("ERROR is " + err);
      }
      else {
        var sql_delete = `DELETE FROM consists WHERE coid =`
        console.log("Coid is" + coidDelete.rows[0].coid);
        var full_sql_delete = sql_delete + coidDelete.rows[0].coid + `;`;
        pool.query(full_sql_delete, (err, thatnewflid) => {
          if (err) {
            console.log("ERROR is " + err);
          }
          else {
            var add_sql_back = `Update foods
            Set dailylimit = dailylimit + 1
            WHERE fname = '`;
            var add_sql_back2 = `' And rname = '`
            var add_sql_back_full = add_sql_back + req.body.fname + add_sql_back2 + req.body.rname + `';`;
            
            var checksql = `Update foods 
            Set isavailable = true 
            WHERE dailylimit > 0
            AND fname = '`
            var checksql2 = `' AND rname = '`
            var fullchecksql = checksql + req.body.fname + checksql2 + req.body.rname + `';`;

            var updatecost_sql = `Update foodlists
            Set total_cost = total_cost - (Select price
            from foods
            where fname = '` + req.body.fname + 
            `'and rname = '` + req.body.rname + `')
            WHERE flid = ` + sess.flid + `;`;

            var totalfullsql = add_sql_back_full + fullchecksql + updatecost_sql;

            console.log(totalfullsql);

            pool.query(totalfullsql, (err, thatnewflid) => {
              if (err) {
                console.log("ERROR is " + err);
              }
              else {
                res.redirect("/orderFood");
              }
      
      
      
            });
      

            
            
          }



        });

      }



    });




  }

  else if (req.body.action == "Checkout") {

    var urlthing = `/checkout?points=` + req.body.rewardnumbertobuy;
    res.redirect(urlthing);

  }
});

module.exports = router;
