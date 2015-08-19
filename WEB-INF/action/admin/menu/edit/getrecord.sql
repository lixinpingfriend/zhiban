select	
	m.menu_id
	,m.title_cn
	,m.title_en
	,m.position
	,m.parentmenu_id
	,p.title_cn as p_menu_name
	,m.logo_path
from 
	${schema}s_menu m
	left join ${schema}s_menu p
	on m.parentmenu_id = p.menu_id
where 
	m.menu_id = ${fld:id}