insert into pm_device_run_trouble
(
	tuid,
	status,
	trouble_date,
	createby
)
values(
	${seq:nextval@${schema}seq_pm_device_run_trouble},
	0,
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
	${ses:userId}
)