insert into s_department
(
	tuid,
	name
)
values 
(
	seq_department.nextval,
	${fld:name}
)
