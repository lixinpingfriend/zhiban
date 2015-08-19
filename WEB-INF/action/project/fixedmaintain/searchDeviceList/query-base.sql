select 
  tuid,name,device_model,machine_no,remark,
  (case device_status when 1 then '设备正常'
  else '修理状态' end ) as device_status
from 
	pm_device
where 
	delete_flag = 0
