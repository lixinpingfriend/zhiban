update
	t_term_type
SET
	type_name = ${fld:type_name}
	,show_order = ${fld:show_order}
	,remark = ${fld:remark}
where
	tuid = ${fld:tuid}
