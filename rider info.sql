-- generate rider information

with totalworkinghours as (
    with fulltimers as (
        with fulltime as (
            select riderid, 40 as hours from fulltimeriders
        )
        select riderid, case
            when hours is null then 0
            else hours
            end
        from riders left join fulltime using (riderid)
    ),
    parttimers as (
        select riderid, case
            when sum(totalhours) is null then 0
            else sum(totalhours)
            end as totalhours
        from riders left join ((holds natural join sessions) natural join wws) using (riderid)
        group by riderid
        order by riderid
    )
    select riderid, hours + totalhours as totalhours from fulltimers natural join parttimers
),
totalsalary as (
    with riderbasesalary as (
        SELECT distinct riderid, CASE
            WHEN wwsid IS NOT NULL then weeklybasesalary
            ELSE monthlybasesalary
            END AS salary
        FROM (riders LEFT JOIN fulltimeriders using (riderid) LEFT JOIN parttimeriders USING (riderid) left join wws using (riderid))
    ),
    ridernumdeliveries as (
        select riderid, count(*) as numofdeliveries from delivers
        group by riderid
    )
    select riderid, case
        when numofdeliveries is null then salary
        else (salary + (numofdeliveries * 5))
        end as totalsalary,
        salary, case
            when numofdeliveries is null then 0
            else numofdeliveries
            end
    from riderbasesalary left join ridernumdeliveries using(riderid) order by riderid
)
select *, case
    when riderid in (select riderid from parttimeriders) then 'part timer'
    when riderid in (select riderid from fulltimeriders) then 'full timer'
    else 'error'
    end as status, ridername from (totalworkinghours natural join totalsalary) natural join riders;
