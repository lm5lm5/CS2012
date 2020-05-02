DROP TABLE IF EXISTS Maintains, WWS, Contains, Schedules, Consists;


-- left side ===============================
CREATE TABLE WWS (
        WWSid Integer,
        DayOfWeek Integer,
        primary key (WWSid)
);

CREATE TABLE Maintains (
        RiderId Integer not null,
        WWSid Integer not null,
        primary key (RiderId, WWSid), 
        foreign key (WWSid) references WWS (WWSid) on delete cascade
);

CREATE TABLE Contains (
        WWSid Integer,
        TotalHours Integer,
        EndInterval time,
        StartInterval time
);

CREATE TABLE Sessions (
        TotalHours Integer,
        EndInterval time,
        StartInterval time
);


-- right side ===================================
-- contains used twice, change to comprises

CREATE TABLE MWS (
        MWSId Integer primary key
);

CREATE TABLE Follows (
        RiderId Integer not null,
        MWSId Integer not null,
        primary key (RiderId, MWSId), 
        foreign key (MWSId) references MWS (MWSId) on delete cascade
);

CREATE TABLE Comprises (
        ShiftDayId Integer,
        ShiftHourId Integer,
		foreign key (ShiftDayId) references ShiftDay (ShiftDayId) ,
		foreign key (ShiftHourId) references ShiftHour (ShiftHourId) 
);

CREATE TABLE ShiftDay (
       ShiftDayId Integer primary key
);

CREATE TABLE ShiftHour (
       ShiftHourId Integer primary key
);
