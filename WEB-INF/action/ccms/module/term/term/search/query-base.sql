select 
	tuid,
	term_name,
	term_type,
	remark,
	(case when status = '0' then '禁用' else '启用' end) as status
 from 
 	t_term
 where
 	tenantry_id = ${def:tenantry}
 
 	
 	${filter}
 	${orderby}