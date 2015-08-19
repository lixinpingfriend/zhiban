select 
	tuid 
from 
	pm_duty_join
where 
to_char(hand_date,'yyyy-MM-dd')='${def:date}'

