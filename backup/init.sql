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
customer;

--done
create table Promotions(
    promoId Integer primary key,
    descriptionPromo varchar(200),
    discount decimal,
    startDate DATE,
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
    SecondHalfStart Integer
);

--done
CREATE TABLE Sessions (
    Sessionsid Integer primary key,
    TotalHours Integer,
    EndInterval Integer check(EndInterval >= 10 and EndInterval <= 22),
    StartInterval Integer check(EndInterval >= 10 and EndInterval <= 22)
);


--done
CREATE TABLE MWS (MWSId Integer primary key);

--done
CREATE TABLE WWS (
    WWSid Integer,
    DayOfWeek Integer,
    primary key (WWSid)
);

--done
CREATE TABLE Customer (
    Cid int PRIMARY KEY,
    Reward_pts int default 0,
    CC_no int,
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
    rating INTEGER
);

--done
create table Restaurants(
    rname varchar(100) NOT NULL,
    promoId Integer,
    FOREIGN KEY (promoId) REFERENCES Promotions (promoId),
    primary key(rname)
);

--done
create table Foods(
    fname varchar(100) NOT NULL,
    rname varchar(100) NOT NULL,
    dailyLimit Integer,
    isavailable boolean,
    category VARCHAR(60),
    price decimal,
    primary key(fname, rname),
    FOREIGN KEY (rname) REFERENCES Restaurants (rname) on delete cascade
);

--done
create table Foodlists(
    flId Integer primary key,
    Cid int not null references Customer(cid),
    Riderid int NOT NULL,
    Promoid int,
    Order_time time,
    Restaurant_name text,
    Payment_method text,
    Total_cost numeric,
    Delivery_location text,
    Did INt Unique,
    FOREIGN KEY (Did) REFERENCES Delivers(Did)
);

--done
create table Consists(
    flId Integer,
    fname varchar(100),
    rname varchar(100) NOT NULL,

    cId Integer primary key,
    FOREIGN KEY (fname, rname) REFERENCES Foods (fname, rname),
    FOREIGN KEY (flId) REFERENCES Foodlists (flId)
);

-- done
CREATE TABLE Reviews (
    Review text,
    Flid int references Foodlists(flid),
    primary key(Flid)
);

--done
create table PartTimeRiders (
    riderid Integer primary key REFERENCES Riders on delete cascade,
    wwsid int not null,
    foreign key (wwsid) references WWS(wwsid),
    weeklybasesalary Integer
);

--done
create table FullTimeRiders (
    riderid Integer primary key references Riders on delete cascade,
    mwsid int not null,
    foreign key (mwsid) references MWS(mwsid),
    monthlybasesalary Integer
);

--holds
create table DeliverPromotions (
    pid INTEGER primary key,
    descriptionPromo varchar(200),
    discount decimal,
    startDate DATE,
    endDate Date,
    did int not null,
    foreign key (did) references Delivers
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
    foreign key (ShiftHourId) references ShiftHour (ShiftHourId)
);


