update 
	pm_device
set 
	name = ${fld:name},
	device_model = ${fld:device_model},
	machine_no = ${fld:machine_no},
	remark = ${fld:remark}
where
	tuid = ${fld:tuid}
