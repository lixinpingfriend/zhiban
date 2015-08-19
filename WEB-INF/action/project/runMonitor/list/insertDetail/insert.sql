insert into pm_device_run_detail
(
	tuid,
	run_id,
	created,
	createby,
	status,
	domain_id
)
values 
(
	${seq:nextval@seq_pm_device_run_detail},
	${fld:run_id},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId},
	
	0,
	${fld:domain_id}
)
