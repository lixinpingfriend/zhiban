update
	t_term
SET
	term_name = ${fld:term_name}
	,term_type = ${fld:term_type}
	,pre_class = ${fld:pre_class}
	,post_class = ${fld:post_class}
	,remark = ${fld:remark}
	,status = ${fld:status}
	,logo_path = ${fld:logo_path}
where
	tuid = ${fld:tuid}
