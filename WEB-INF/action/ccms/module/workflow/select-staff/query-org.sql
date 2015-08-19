select
	t.userlogin
	,t.name
	,o.org_id
	,o.org_name
from
	hr_staff t
	inner join hr_org o on t.org_id = o.org_id
where
	t.userlogin in ${lst:id@query-staff.sql}

order by t.show_order