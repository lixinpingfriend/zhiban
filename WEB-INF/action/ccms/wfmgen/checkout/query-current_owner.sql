select
	c.owner
	,s.name
	,s.alias
from
	os_currentstep c
	inner join hr_staff s on c.owner=s.userlogin
where
	id = ${fld:current_id}