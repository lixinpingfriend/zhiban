select 
	tuid,plan_date
from 
	pm_duty
where 
	plan_date =to_date('2015-06-21','yyyy-MM-dd')
