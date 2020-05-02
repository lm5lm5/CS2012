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
)

CREATE TABLE Reviews (
	Review text,
	Fld int Not Null references  Orders.flid,
	Cid int Not Null references Customer.Cid,
	primary key(Fld,Cid)
	 
)

CREATE TABLE Rates (
	Riderid int Primary key references Delivers.Riderid
	Rating text
	Promoid int Unique references Promotion.promoid
	
)