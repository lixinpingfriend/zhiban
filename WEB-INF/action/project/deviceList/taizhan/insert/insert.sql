insert into pm_area(
	tuid,
	name,
	p_id
)
values 
(
	${seq:nextval@seq_pm_area},
	${fld:name},
	${fld:p_id}
)
