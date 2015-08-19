SELECT
	replace(replace(f.update_js,'${DEF','${def'),'${LBL','${lbl')    as  update_js
	,f.table_id
FROM
	t_form f
	inner join t_document d on d.form_id = f.tuid
WHERE
    d.tuid = ${fld:document_id}
