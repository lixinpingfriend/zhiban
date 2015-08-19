select 
	u.user_id,u.fname
from 
	s_user u
where
	u.dep_id = ${fld:danwei}
and
  u.user_id not in (
     select user_id from pm_person_qualifications q where q.domain_id = ${fld:domain_id}
  )