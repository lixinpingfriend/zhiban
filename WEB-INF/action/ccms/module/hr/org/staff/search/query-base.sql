select 
	g.org_name,
	t.user_id,
	t.userlogin,
	t.name,
	t.mobile,
	t.address,
	t.userlogin as tuid,
	case when t.sex='0' then '男'
	     when t.sex='1' then '女'
	end as sex,
	case when s.enabled = 1 then '正常'
	     when s.enabled = 0 then '被禁止'
	end as state,
	case when s.enabled = 1 then concat(concat('<a href="javascript:void(0);" title="禁用用户" onclick="javascript:onBlock(',t.user_id),')">禁用</a>')
	     when s.enabled = 0 then concat(concat('<a href="javascript:void(0);" title="启用用户" onclick="javascript:onEnable(',t.user_id),')">启用</a>')
	end as state_operator,
	t.alias,
	t.email
from	     
	hr_staff t
	inner join ${schema}s_user s on t.user_id = s.user_id
	left join hr_org g on t.org_id=g.org_id
where 
	t.tenantry_id = ${def:tenantry}

	${filter}
	${orderby}