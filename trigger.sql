CREATE OR REPLACE FUNCTION func_check_ShiftDay()
RETURNS TRIGGER AS 
$$ BEGIN
  IF EXISTS(SELECT 1 FROM ShiftDay WHERE NEW.shifthourid = ShiftDay.shifthourid)
THEN RAISE EXCEPTION 'ShiftDay already exists';
RETURN NULL;
  ELSIF EXISTS(SELECT 1 FROM ShiftDay WHERE NEW.shiftdayid < 1 or NEW.shiftdayid > 7)
THEN RAISE EXCEPTION 'ShiftDay not created as it can only be from 1 to 7';
RETURN NULL;
  ELSIF EXISTS(SELECT 1 FROM ShiftDay WHERE NEW.startday not in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
  THEN RAISE EXCEPTION 'Startday must be from Monday to Sunday! (eg. Tuesday)';
RETURN NULL;
  ELSIF EXISTS(SELECT 1 FROM ShiftDay WHERE NEW.endday not in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
  THEN RAISE EXCEPTION 'Endday must be from Monday to Sunday! (eg. Tuesday)';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_check_ShiftHour()
RETURNS TRIGGER AS 
$$ BEGIN
  IF EXISTS(SELECT 1 FROM ShiftHour WHERE NEW.shifthourid = ShiftHour.shifthourid)
THEN RAISE EXCEPTION 'ShiftDay already exists';
RETURN NULL;
  ELSIF EXISTS(SELECT 1 FROM ShiftHour WHERE NEW.shifthourid < 1 or NEW.shifthourid > 4)
THEN RAISE EXCEPTION 'ShiftHour not created as it can only be from 1 to 4';
RETURN NULL;
  ELSIF EXISTS(SELECT 1 FROM ShiftHour WHERE (NEW.firsthalfstart, NEW.firsthalfend, NEW.secondhalfstart, NEW.secondhalfend) not in ((10, 14, 15, 19),(11, 15, 16, 20),(12, 16, 17, 21),(13, 17, 18, 22)))
  THEN RAISE EXCEPTION 'There are only 4 different shifts: Shift 1: 10am to 2pm and 3pm to 7pm.';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_insert_ShiftDay ON ShiftDay;
CREATE TRIGGER check_insert_ShiftDay
BEFORE INSERT ON ShiftDay
FOR EACH ROW
EXECUTE PROCEDURE func_check_ShiftDay();

DROP TRIGGER IF EXISTS check_insert_ShiftHour ON ShiftHour;
CREATE TRIGGER check_insert_ShiftHour
BEFORE INSERT ON ShiftHour
FOR EACH ROW
EXECUTE PROCEDURE func_check_ShiftHour();


--check if the riders follow isa constraint, each entity in superclass must be in a subclass and vice-versa and doesnt overlap
CREATE OR REPLACE FUNCTION func_check_parttimeriderISA()
RETURNS TRIGGER AS 
$$ BEGIN 
  IF EXISTS(select 1 from fulltimeriders f where NEW.riderid = f.riderid)
THEN RAISE EXCEPTION 'There exists overlapping rider ids';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_check_fulltimeriderISA()
RETURNS TRIGGER AS 
$$ BEGIN 
  IF EXISTS(select 1 from parttimeriders p where NEW.riderid = p.riderid)
THEN RAISE EXCEPTION 'There exists overlapping rider ids';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_insert_parttimeriderISA ON parttimeriders;
CREATE TRIGGER check_insert_parttimeriderISA
BEFORE INSERT ON parttimeriders
FOR EACH ROW
EXECUTE PROCEDURE func_check_parttimeriderISA();

DROP TRIGGER IF EXISTS check_insert_fulltimeriderISA ON fulltimeriders;
CREATE TRIGGER check_insert_fulltimeriderISA
BEFORE INSERT ON fulltimeriders
FOR EACH ROW
EXECUTE PROCEDURE func_check_fulltimeriderISA();

CREATE OR REPLACE FUNCTION func_check_parttimeriderISA()
RETURNS TRIGGER AS 
$$ BEGIN 
  IF EXISTS(select 1 from fulltimeriders f where NEW.riderid = f.riderid)
THEN RAISE EXCEPTION 'There exists overlapping rider ids';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION func_check_fulltimeriderISA()
RETURNS TRIGGER AS 
$$ BEGIN 
  IF EXISTS(select 1 from parttimeriders p where NEW.riderid = p.riderid)
THEN RAISE EXCEPTION 'There exists overlapping rider ids';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--check if the total hours for wws is 10 <= hours <= 48
CREATE OR REPLACE FUNCTION func_check_holds()
RETURNS TRIGGER AS 
$$ BEGIN 
  IF EXISTS(with riderhours as (select riderid, sum(totalhours) totalhours
from wws natural join (holds natural join sessions)
group by riderid
order by riderid)
select *
from riderhours where totalhours < 10)
THEN RAISE EXCEPTION 'There are riders with less than 10 working hours';
RETURN NULL;
  ELSIF EXISTS(with riderhours as (select riderid, sum(totalhours) totalhours
from wws natural join (holds natural join sessions)
group by riderid
order by riderid)
select *
from riderhours where totalhours > 48)
THEN RAISE EXCEPTION 'There are riders with more than 48 working hours';
RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_insert_holds ON holds;
CREATE TRIGGER check_insert_holds
BEFORE INSERT ON holds
FOR EACH ROW
EXECUTE PROCEDURE func_check_holds();

DROP TRIGGER IF EXISTS check_delete_holds ON holds;
CREATE TRIGGER check_delete_holds
BEFORE DELETE ON holds
FOR EACH ROW
EXECUTE PROCEDURE func_check_holds();

DROP TRIGGER IF EXISTS check_update_holds ON holds;
CREATE TRIGGER check_update_holds
BEFORE UPDATE ON holds
FOR EACH ROW
EXECUTE PROCEDURE func_check_holds();

-- restaurant constraint triggers
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