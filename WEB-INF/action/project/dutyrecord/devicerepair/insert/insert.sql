insert into pm_device_repair(
	tuid,
	backup__goods_id,
	principal_id,
	created,
	check_status,
	createdby,
	device_id,
	repair_by,
	telephone,
	unit_name,
	repaird
	)
values 
(
	${seq:nextval@seq_pm_device_repair},
	${fld:backup__goods_id},
	${fld:principal_id},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${fld:check_status},
	${ses:userId},
	${fld:device_id},
	${fld:repair_by},
	${fld:telephone},
	${fld:unit_name},
	to_date(${fld:repaird},'yyyy-MM-dd')
)
