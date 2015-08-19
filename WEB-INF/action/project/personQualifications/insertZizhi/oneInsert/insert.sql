insert into pm_person_qualifications(
	tuid,
	user_id,
	created,
	createdby,
	begin_date,
	end_date,
	domain_id
)
values 
(
	${seq:nextval@seq_pm_person_qualifications},
	${fld:user_id},
	{d '${def:date}'},
	${ses:userId},
	${fld:begin_date},
	${fld:end_date},
	${fld:domain_id}
)
