
create table  Restaurants(
	rname             varchar(100) NOT NULL,
	promoId                Integer
	FOREIGN KEY (promoId) REFERENCES Promotions 
	primary key(rname)
);

create table  Foods(
	fname             varchar(100) NOT NULL,
	rname             varchar(100) NOT NULL,
	dailyLimit         Integer,
	isavailable      	boolean,
	category 			VARCHAR(60),
	price				 decimal,
	primary key(fname, rname),
	FOREIGN KEY (rname) REFERENCES Restaurants on delete cascade
);


create table  Consists(
  flId             Integer,
  fname             varchar(100),
  cId       Integer primary key,
  FOREIGN KEY (fname) REFERENCES Foods,
  FOREIGN KEY (flId) REFERENCES Foodlists
);

create table  Promotions(
	promoId             Integer primary key,
	descriptionPromo    		varchar(200),
	discount			decimal
	startDate			DATE
	endDate				Date

);

create table  Foodlists(
	flId             Integer primary key,
	fname             varchar(100) NOT NULL,
	Cid int not null references Customer.cid,
	FOREIGN KEY (fname) REFERENCES Foods,
	Riderid int NOT NULL,
	Promoid int,
	Order_time time,
	Restaurant_name text,
	Payment_method text,
	Total_cost numeric,
	Delivery_location text,
	Did INt Unique,
	FOREIGN KEY (Did) REFERENCES Delivery(Did)
	
);

CREATE TABLE Customer (
	Cid int PRIMARY KEY,
	Reward_pts int,
	CC_no int,
	FirstLoc text,
	SecondLoc text,
	ThirdLoc text,
	FourthLoc text,
	FifthLoc text,
	No_of_loc int default 0
);

CREATE TABLE Reviews (
	Review text,
	Fld int references  Foodlists.flid,
	Cid int references Customer.Cid,
	primary key(Fld,Cid)
	 
);

-- create databases part 3

-- triggers to create
-- 1. overlap constrint of Riders
-- 2.

create table Riders (
    riderid             Integer primary key,
    ridername                VARCHAR(60),
)
create table PartTimeRiders (
    riderid             Integer primary key REFERENCES Riders on delete cascade,
    weeklybasesalary    Integer,
)

create table FullTimeRiders (
    riderid             Integer primary key references Riders on delete cascade,
    monthlybasesalary   Integer,
)

create table Delivers (
    -- temporary did as primary key
    did                 INTEGER primary key,
    deliveryfee         decimal,
    customerplaceorder  timestamp,
    ridergotorest       timestamp,
    rideratrest         timestamp,
    riderleftrest       timestamp,
    riderdeliverorder   timestamp,
    riderid integer not null,
    FOREIGN KEY(riderid) REFERENCES Riders(riderid), 
    rating              INTEGER
)；

create table DeliverPromotions (
    pid                 INTEGER primary key,
    descriptionPromo    		varchar(200),
	discount			decimal,
	startDate			DATE,
	endDate				Date,
    did int not null,
    foreign key (did) references Delivers
	
);