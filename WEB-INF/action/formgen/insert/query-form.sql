SELECT
	replace(replace(f.insert_js,'${DEF','${def'),'${LBL','${lbl')    as  insert_js
	,concat('','') as bpk_field_value
	,f.table_id
	,null as wfentry_id
	,null as current_step_id
FROM
	t_form f
WHERE
	f.tuid = ${fld:form_id}