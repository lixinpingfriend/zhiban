insert into pm_device_repair_log(
	tuid,
	duty_id,
	created,
	createby,
	content,
	repair_id,
	entity_type
	)
values 
(
	${seq:nextval@seq_pm_device_repair_log},
	${fld:duty_id},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId},
	${fld:content},
	${fld:repairId},
	${fld:entity_type}
)
