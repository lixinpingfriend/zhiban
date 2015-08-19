select
	t.org_id,
	case when t.pid is null then 0 else t.pid end as pid,
	t.org_path,
	t.org_name 
from
	hr_org t 

order by t.org_name asc
