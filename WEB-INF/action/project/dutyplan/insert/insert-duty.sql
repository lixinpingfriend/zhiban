insert into pm_duty
(
	tuid,
	user_id,
	plan_date,
	begin_date,
	end_date,
	createby,
	created,
	is_deleted
)
values 
(
	${seq:nextval@seq_pm_duty},
	${fld:user_id},
	to_date(${fld:plan_date},'yyyy-MM-dd'),
	${fld:begin_date},
	${fld:end_date},
	${ses:userId},
	sysdate,
	0
)
