select
 	tuid
	,term_name
	,term_type
	,pre_class
	,post_class
	,remark
	,status
	,logo_path
from
	t_term
WHERE
	tuid = ${fld:tuid}