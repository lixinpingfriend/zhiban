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
	${fld:event_type},
	to_date(${fld:plan_date},'yyyy-MM-dd'),
	${fld:remark},
	${fld:entity_id},
	${fld:repair_id},
	${fld:plan_id},
	${fld:relation_record_id},
	${fld:duty_id}
)
