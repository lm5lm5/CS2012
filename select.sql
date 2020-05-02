--search name, not sure the syntax...
select rname
from restaurants
where rname like '%$keyword'
or rname like '$keyword%';

--select wws with day x
select wwsid
from wws
where dayofweek = 1;

--select sessions with totalhours
select sessionsid
from sessions
where totalhours = 4;

--compute for each rider total num of deliveries
with numdeliveries as (
select riderid, count(riderid) 
from delivers 
group by riderid)
select r.riderid, case when num.count is null then 0 else num.count end
from riders r left join numdeliveries num
on r.riderid = num.riderid;

