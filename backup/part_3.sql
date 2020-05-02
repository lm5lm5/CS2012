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