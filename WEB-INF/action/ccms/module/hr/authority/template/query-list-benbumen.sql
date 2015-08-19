select
	g.org_id
	,g.org_name
	,p.tuid as post_id
	,p.org_post_name as post_name
	,f.userlogin
	,f.name as staff_name
from
	hr_org g
	inner join  hr_staff f on f.org_id = g.org_id
	inner join ${schema}s_user u on f.userlogin = u.userlogin and u.enabled = 1
	left join hr_post_staff ps on f.userlogin = ps.userlogin
	left join hr_org_post p on ps.org_post_id = p.tuid
where
	exists(
		select 1 from hr_org h1
		where
			exists(
				select 1 from hr_staff hf inner join hr_org hg on hf.org_id=hg.org_id
				where hf.userlogin = '${staff}' and charindex(h1.org_path,hg.org_path) >= 1
			)
		and
			h1.org_type = '1'
		and
			exists(
				select 1 from (
					select max(len(h2.org_path)) as max_len from hr_org h2
					where
						exists(
							select 1 from hr_staff hf inner join hr_org hg on hf.org_id=hg.org_id
							where hf.userlogin = '${staff}' and charindex(h2.org_path,hg.org_path) >= 1
						)
					and
						h2.org_type = '1'
				) tt 
				where tt.max_len = len(h1.org_path)
			)
		and
			charindex(h1.org_path,g.org_path) >= 1
	)
and
	g.tenantry_id = (select tenantry_id from hr_staff where userlogin = '${staff}')