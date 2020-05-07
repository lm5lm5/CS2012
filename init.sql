-- Updated 1 may 1am changed cc_no into text instead of int

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

drop table if exists promotions,
shiftday,
shifthour,
sessions,
mws,
wws,
restaurants,
foods,
consists,
foodlists,
reviews,
riders,
parttimeriders,
fulltimeriders,
delivers,
deliverpromotions,
holds,
comprises,
customer,
customerLogin;

--done
create table Promotions(
    promoId Integer primary key,
    descriptionPromo varchar(200),
    discount decimal,
    startDate date,
    endDate Date
);

--done
CREATE TABLE ShiftDay (
    ShiftDayId Integer primary key,
    StartDay VARCHAR(100),
    EndDay VARCHAR(100)
);

--done
CREATE TABLE ShiftHour (
    ShiftHourId Integer primary key,
    FirstHalfStart Integer,
    FirstHalfEnd Integer,
    SecondHalfStart Integer,
    SecondHalfEnd Integer
);


--done
CREATE TABLE Sessions (
    Sessionsid Integer primary key,
    TotalHours Integer check(TotalHours>=1 and TotalHours<=2),
    EndInterval Integer check(EndInterval >= 10 and EndInterval <= 22),
    StartInterval Integer check(EndInterval >= 10 and EndInterval <= 22)
);


--done
CREATE TABLE MWS (
    MWSId Integer primary key
);

--done
CREATE TABLE Customer (
    Cid int PRIMARY KEY,
    Reward_pts int default 0,
    CC_no text,
    FirstLoc text,
    SecondLoc text,
    ThirdLoc text,
    FourthLoc text,
    FifthLoc text,
    No_of_loc int default 0
);

--done
create table Riders (
    riderid Integer primary key,
    ridername VARCHAR(60)
);

--holds
create table DeliverPromotions (
    pid INTEGER primary key,
    descriptionPromo varchar(200),
    discount decimal,
    startDate DATE,
    endDate Date
);

--done
create table Delivers (
    -- temporary did as primary key
    did INTEGER primary key,
    deliveryfee decimal,
    customerplaceorder timestamp,
    ridergotorest timestamp,
    rideratrest timestamp,
    riderleftrest timestamp,
    riderdeliverorder timestamp,
    riderid integer not null,
    FOREIGN KEY(riderid) REFERENCES Riders(riderid),
    rating INTEGER,
    pid integer,
    FOREIGN KEY(pid) REFERENCES deliverpromotions
);

--done
create table Restaurants(
    rname varchar(100) NOT NULL,
    promoId Integer,
    minimalCost Integer NOT NULL,
    primary key(rname),
    constraint restaurant_fkey FOREIGN KEY (promoId) REFERENCES Promotions (promoId) deferrable initially deferred
);

CREATE TABLE Food_categories (
    category VARCHAR(60),
    category_meaning text UNIQUE NOT NULL,
    PRIMARY KEY (category)

);

--done
create table Foods(
    fname varchar(100) NOT NULL,
    rname varchar(100) NOT NULL,
    dailyLimit Integer,
    isavailable boolean,
    category VARCHAR(60) references Food_categories (category),
    price decimal,
    primary key(fname, rname),
    FOREIGN KEY (rname) REFERENCES Restaurants (rname) on delete cascade
);

--done
create table Foodlists(
    flId Integer primary key,
    Cid int not null references Customer(cid) on delete cascade,
    Riderid int,
    Promoid int,
    Order_time date,
    Restaurant_name text,
    Payment_method text,
    Total_cost numeric default 0,
    Delivery_location text,
    Did integer,
	unique(Did),
    FOREIGN KEY (Did) REFERENCES Delivers(Did)
);

--done
create table Consists(
    Coid integer,
    flId Integer,
    fname varchar(100),
    rname varchar(100),

    Primary key (coid),
    FOREIGN KEY (fname, rname) REFERENCES Foods (fname, rname),
    FOREIGN KEY (flId) REFERENCES Foodlists (flId) on delete cascade
);

-- done
CREATE TABLE Reviews (
    Review text,
    Flid int references Foodlists(flid) on delete cascade,
    primary key(Flid)
);

--done
create table PartTimeRiders (
    riderid Integer primary key REFERENCES Riders on delete cascade,
    weeklybasesalary Integer
);

--done
CREATE TABLE WWS (
    WWSid Integer check (WWSid > 0),
    DayOfWeek Integer check ((DayOfWeek >= 1) and (DayOfWeek <= 7)),
	riderid Integer,
    primary key (WWSid),
	FOREIGN KEY(riderid) REFERENCES parttimeriders (riderid)
);

--done
create table FullTimeRiders (
    riderid Integer primary key references Riders on delete cascade,
    mwsid int not null,
    foreign key (mwsid) references MWS(mwsid),
    monthlybasesalary Integer
);

--holds
CREATE TABLE Holds (
    WWSid Integer,
    foreign key (WWSid) references WWS(wwsid),
    Sessionsid Integer,
    foreign key (Sessionsid) references Sessions(Sessionsid),
    Primary Key (WWSid, Sessionsid)
);


--done
CREATE TABLE Comprises (
    MWSid Integer,
    Primary Key (MWSid),
    ShiftDayId Integer,
    ShiftHourId Integer,
    foreign key (ShiftDayId) references ShiftDay (ShiftDayId),
    foreign key (ShiftHourId) references ShiftHour (ShiftHourId),
    foreign key (MWSid) references MWS (MWSid)
);


CREATE TABLE customerLogin (
    Username text NOT NULL,
    Password text NOT NULL,
    Cid int,
    PRIMARY KEY (Cid),
    Unique(Username),
    foreign Key (cid) references Customer(cid) on delete cascade
);

CREATE TABLE riderLogin (
    Username text NOT NULL,
    Password text NOT NULL,
    riderid Integer,
    PRIMARY KEY (riderid),
    Unique(Username),
    foreign Key (riderid) references Riders(riderid) on delete cascade
);

CREATE TABLE staffLogin (
    Username text NOT NULL,
    Password text NOT NULL,
    Restaurant_name text not null,
    staffid Integer,
    PRIMARY KEY (staffid),
    unique(Restaurant_name, Username),
    foreign Key (Restaurant_name) references Restaurants(rname)
);

CREATE TABLE managerLogin (
    Username text NOT NULL,
    Password text NOT NULL,
    mid Integer,
    PRIMARY KEY (mid),
    UNIQUE(Username)
);


CREATE TABLE foodlistCost (
    flid integer,
    Reward_pts integer default 0,
    promoId integer,
    pid integer,
    deliveryfee integer,
    final_cost numeric default 0,
    Primary Key (flid), 
	foreign key (flid) references foodlists on delete cascade

);
