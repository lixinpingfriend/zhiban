insert into pm_duty_join
(
	tuid,
	tool_condition,
	sanitation_condition,
	fire_condition,
	hand_id,
	hand_date,
	plan_record_id,
	carry_id
)
values 
(
	${seq:nextval@seq_pm_duty_join},
	${fld:tool_condition},
	${fld:sanitation_condition},
	${fld:fire_condition},
	${fld:hand_id},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	0,
	${fld:carry_id}
	
)
