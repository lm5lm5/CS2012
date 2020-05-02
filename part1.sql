
-- creation 

-- deletion

-- update

-- restaurants 

-- foods

-- foodlist

-- consist

-- promotions

-- create or replace function findRestaurants(out rname varchar(100), out fname varchar(100))

-- 	$$lanuguage sql;

-- select f1.rname, f1.fname

-- from foods f1 
-- where f1.rname in (select f1.rname group by f1.rname);

-- select f1.rname, f1.fname
-- from foods f1 join foods f2 on f1.rname = f2.rname
-- where f1.fname = f2.fname
-- order by f1.rname;



CREATE OR REPLACE FUNCTION func_checkInsert()
RETURNS TRIGGER AS 
$$ BEGIN
IF EXISTS(SELECT 1 FROM Restaurants WHERE NEW.rname = Restaurants.rname)
THEN RAISE EXCEPTION 'Restaurants not created because it already exists!';
RETURN NULL;
ELSIF EXISTS(SELECT 1 FROM Foods WHERE NEW.fname = Foods.fname and NEW.rname = Foods.rname)
THEN RAISE EXCEPTION 'Foods not created because it already exists!';
RETURN NULL;
ELSIF EXISTS(SELECT 1 FROM Promotions WHERE NEW.promoId = Promotions.promoId)
THEN RAISE EXCEPTION 'Promotions not created because it already exists!';
RETURN NULL;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_insertFoods
BEFORE INSERT ON Foods
FOR EACH ROW
EXECUTE PROCEDURE func_checkInsert();

CREATE TRIGGER check_insertRestaurants
BEFORE INSERT ON Restaurants 
FOR EACH ROW
EXECUTE PROCEDURE func_checkInsert();

CREATE TRIGGER check_insertPromotions
BEFORE INSERT ON Promotions 
FOR EACH ROW
EXECUTE PROCEDURE func_checkInsert();

-- display all foods belong to the same restaurants
-- menue for all restaurants
select f1.rname, f1.fname, f1.price
from foods f1 join foods f2 on f1.rname = f2.rname and f1.fname = f2.fname
order by f1.rname, f1.fname;

-- menue for a particular restaurants
select f1.rname, f1.fname, f1.price
from foods f1 join foods f2 on f1.rname = f2.rname and f1.fname = f2.fname
where f1.rname = 'Preformed Line Products Company'
order by f1.rname, f1.fname;

-- menue for a food belong to categry_ 5 restaurants with the minimal price
select f1.rname, f1.fname, f1.category, f1.price
from foods f1 join foods f2 on f1.rname = f2.rname and f1.fname = f2.fname
where f1.category = 'category_5'
order by f1.price, f1.rname, f1.fname;

-- display all restaurants sells the same foods
select f1.fname, f1.rname, f1.price
from foods f1 join foods f2 on f1.rname = f2.rname and f1.fname = f2.fname
order by f1.fname, f1.rname;

-- check customer's foodlists by cid
select f.cid as customer_ID, f.flid as order_ID, c.rname as fromResturant, c.fname as foodOrdered, f.riderid, f.promoId, f.order_time, f.payment_method, f.total_cost,f.delivery_location
from foodlists f natural join consists c
where f.cid = 113;

-- customer location missing 
-- promotion_res starting time/date should be future time. 
-- promoId in foodlists should be include as a constrates as it can check with restaurants to get the valid promotion (also need to check the delivery promotion)
-- discound in foodlist should be include as it is the same as the promotion_res
-- restaurants need to have the location attributes?
-- no order in the ER diagram 

select * from restaurants;
select * from promotions;
select * from foods;

-- get foodlist foods for eac =h one and give the price
select c.flid, c.fname, foods.price
from foodlists f natural join consists c
join foods on c.fname = foods.fname
;

-- get the total price for foodlists flid = 10
-- select f.flid, sum(foods.price) * promotion as total_cost
select f.flid, sum(foods.price) as total_cost
from foodlists f natural join consists c
join foods on c.fname = foods.fname
where f.flid = 10
group by f.flid;

-- choose a restaurants and then can know the current promotions can be used. there is the situation that there are a lot of diff promotions and should choose the only one. 

create or replace function outputMenue(out fname varchar(100), out rname varchar(100), out price decimal)
	returns setof record as $$
	select f1.rname, f1.fname, f1.price
	from foods f1 join foods f2 on f1.rname = f2.rname and f1.fname = f2.fname
	order by f1.rname, f1.fname;

$$ language sql;

select * from outputMenue();


