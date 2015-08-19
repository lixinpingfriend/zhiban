insert into pm_device_fix_repair(
	tuid,
	date_type,
	check_date,
	device_id,
	check_status,
	functionary_id,
	maintaining_id,
	t_order,
	created
)
values 
(
	${seq:nextval@seq_pm_device_fix_repair},
	${fld:date_type},
	to_date(${fld:check_date},'yyyy-MM-dd'),
	${fld:device_id},
	${fld:check_status},
	${fld:functionary_id},
	${ses:userId},
	${fld:t_order},
	to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:mi:ss.ff')
)
