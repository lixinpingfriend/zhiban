insert into pm_device(
	tuid,name,device_model,machine_no,remark,area_id,delete_flag,device_status
)
values 
(
	${seq:nextval@seq_pm_device},
	${fld:name},
	${fld:device_model},
	${fld:machine_no},
	${fld:remark},
	${fld:area_id},
	0,
	1
)
