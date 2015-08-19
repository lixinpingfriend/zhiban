insert into pm_device_fix_status(
	tuid,
	device_status,
	power_status,
	accessory_status,
	antenna_status,
	other_status,
	temperature,
	humidity,
	device_fix_id,
	remark
)
values 
(
	${seq:nextval@seq_pm_device_fix_status},
	${fld:device_status},
	${fld:power_status},
	${fld:accessory_status},
	${fld:antenna_status},
	${fld:other_status},
	${fld:temperature},
	${fld:humidity},
	${seq:currval@seq_pm_device_fix_repair},
	${fld:remark}
)