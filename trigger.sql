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

