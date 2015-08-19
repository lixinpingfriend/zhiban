insert into pm_plan_record 
(
	tuid,
	created,
	createdby,
	event_type,
	duty_date,
	remark,
	entity_id,
	plan_id,
	duty_id
)
values 
(
	${seq:nextval@seq_pm_plan_record},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId},
	4,
	to_date('${def:date}','yyyy-MM-dd'),
	${fld:remark},
	${fld:entity_id},
	${fld:plan_id},
	${fld:duty_id}
)