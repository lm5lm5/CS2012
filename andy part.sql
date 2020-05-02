-- List all food list reviews

SELECT cid,flid,review
FROM Reviews JOIN Foodlists USING (flid) JOIN Customer USING (cid);

-- List the ratings of the delivery guys left by the customers

With temptable as (
SELECT *
FROM  Delivers JOIN Riders using (riderid)
)
, temptable2 as (
SELECT *
FROM Foodlists JOIN temptable using (Did)
)

SELECT cid, ridername, rating
FROM Customer JOIN temptable2 using (cid);

-- List all the food that a customer cid 113 bought

With temptable as (
SELECT Customer.cid as cid, fname
FROM Customer JOIN Foodlists USING (cid) JOIN Consists USING (flid) JOIN foods using (fname,rname)
)

Select *
FROM temptable
WHERE cid = 442;

-- inserting new location

CREATE or replace procedure newlocation (locationthing text, checkcid integer)
AS $$
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
$$ language sql;

call newlocation (locationthing => 'SON', checkcid => 1);
call newlocation (locationthing => 'JON', checkcid => 1);
call newlocation (locationthing => 'LON', checkcid => 1);
call newlocation (locationthing => 'KON', checkcid => 1);
call newlocation (locationthing => 'NE', checkcid => 1);

--- insert new customer

CREATE or replace procedure addCustomer (ccnumber integer)
AS $$

declare
    maxInt integer;
begin

select max(cid) into maxInt from Customer;
insert into customer (Cid, Reward_pts, CC_no) values (maxInt+1, 0, ccnumber);

end
$$ language plpgsql;

call addCustomer(123456);

--- insert new review

insert into Reviews (review, flid) values ('Example', 12);

--- edit review

CREATE or replace procedure editReview (reviewthing text, flidthing integer)
AS $$

begin

update Reviews
SET review = reviewthing
WHERE Reviews.flid = flidthing;

end
$$ language plpgsql;

call editReview('Example', 10)

--- edit customer

CREATE or replace procedure editcustomer (ccnothing integer, cidthing integer)
AS $$
 
begin

if ccnothing >= 10000000 and ccnothing <= 99999999 then

    update Customer
    SET cc_no = ccnothing
    WHERE cid = cidthing;

end if;

end

$$ language plpgsql;

call editcustomer (10000000,1);

SELECT * FROM customer order by cid;

--- Buying new food (not finished. Havent do check for avalability.)

insert into Foodlists (flid, cid, riderid, order_time, payment_method, total_cost, delivery_location, did) values (11, 229, 1, '17:32', null, 0, null, null);

CREATE OR replace FUNCTION check_food_restuarant_constraint() RETURNS TRIGGER
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
AFTER INSERT on consists
For each row
Execute FUNCTION check_food_restuarant_constraint();


CREATE or replace procedure addFood (flidthing integer, fnamething varchar(100), rnamething varchar(100))
AS $$

declare
    costthing numeric;
    coidthing integer;
 
begin

Select max(coid)+1 into cidthing
from consists;

insert into consists (coid, flid, fname, rname) values (coidthing, flidthing, fnamething, rnamething);

Select price into costthing
from foods
where fname = fnamething
and rname = rnamething;

update foodlists
set total_cost = total_cost + costthing
where flid = flidthing;

end

$$ language plpgsql;

call addFood(11,'Liquor', 'Regulus Therapeutics Inc.');
call addFood(11,'Common verbena', 'Regulus Therapeutics Inc.');
call addFood(11,'Nance', 'Callon Petroleum Company');



insert into Delivers (did, deliveryfee, customerplaceorder, ridergotorest, rideratrest, riderleftrest, riderdeliverorder, riderid, rating) values (101, 12.29, '2019-09-16 11:31:40', '2019-10-29 04:53:24', '2019-11-03 21:48:48', '2019-07-15 16:51:44', '2019-07-28 09:36:23', 256, null);

update Foodlists
SET did = 101
WHERE flid = 11;