select 
	tuid
from
	pm_device_run_detail
where 
	run_id = ${fld:run_id}
and 
	domain_id = ${fld:domain_id}