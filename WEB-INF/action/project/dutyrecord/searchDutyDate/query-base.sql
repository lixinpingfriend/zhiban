select distinct  plan_date  from  pm_duty d
where 1=1 and  exists (select 1 from pm_plan_record r where r.duty_date=d.plan_date)
${filter}
order by plan_date desc