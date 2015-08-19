select
	tuid,name,device_model,machine_no,remark,area_id
from 
	pm_device
where 
	tuid = ${fld:id}