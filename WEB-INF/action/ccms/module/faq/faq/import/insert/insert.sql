insert into t_faq
(
	tuid,
	superior_id,
	show_name,
	lable,
	content,
	tenantry_id,
	start_date,
	end_date,
	faq_type
)
values
(
	${id},
	${fld:superior_id},
	'${show_name}',
	'${lable}',
	'${content}',
	${def:tenantry},
	${fld:start_date},
	${fld:end_date},
	'0'
)
