select
 	tuid
	,list_name
	,list_code
	,list_score
	,show_type
	,is_unspeak
	,list_score_code
	,namespace
	,show_order
	,remark
from
	t_term_list
WHERE
	tuid = ${fld:tuid}