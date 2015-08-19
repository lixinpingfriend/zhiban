select
	t.org_id,
	t.pid,
	t.org_path,
	t.org_name 
from
	hr_org t 
where 
	tenantry_id = ${def:tenantry}
order by 
	t.show_order,t.org_name asc
