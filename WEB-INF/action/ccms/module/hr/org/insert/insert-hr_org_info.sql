insert into hr_org_info
(
	tuid
	,org_id
	,updated 
	,updatedby 
)
values 
(
	 ${seq:nextval@seq_hr_org_info},
	${seq:currval@seq_hr_org},
	{ts '${def:timestamp}'},
	'${def:user}'
)
