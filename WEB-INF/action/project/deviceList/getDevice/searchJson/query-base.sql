select
	tuid,
	name,
	area_id,device_model,machine_no
from 
	pm_device
where 
	delete_flag = 0
	and area_id=${fld:tuid}