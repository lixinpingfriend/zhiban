select
	s.user_id,
	s.fname,
	s.dep_id,
	d.name as dep_name
from 
	s_user s
left join s_department d on d.tuid = s.dep_id
where 
	s.enabled = 1
and 
	 s.user_id not in (
     select user_id from pm_person_qualifications q where q.domain_id = ${fld:domain_id}
  )

	${filter}
	${orderby}