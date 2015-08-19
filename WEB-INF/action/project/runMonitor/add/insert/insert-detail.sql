insert into pm_device_run_detail
(
	tuid,
	run_id,
	created,
	createby,
	duty_id,
	status,
	domain_id
)
values 
(
	${seq:nextval@seq_pm_device_run_detail},
	${seq:currval@seq_pm_device_run_trouble},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId},
	${fld:duty_id},
	0,
	${fld:domain_value}
)
