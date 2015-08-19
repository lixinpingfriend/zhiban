insert into pm_plan_record 
(
	tuid,
	created,
	createdby,
	event_type,
	duty_date,
	remark,
	entity_id,
	repair_id,
	plan_id,
	relation_record_id,
	duty_id
)
values 
(
	${seq:nextval@seq_pm_plan_record},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId},
	2,
	to_date('${def:date}','yyyy-MM-dd'),
	${fld:remark},
	${seq:currval@seq_pm_device_run_trouble},
	${fld:repair_id},
	${fld:plan_id},
	${fld:relation_record_id},
	${fld:duty_id}
)
