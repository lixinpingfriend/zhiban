SELECT
    lower(fi.field_code)	as	field_code
    ,lower(fi.field_code_alias)	as	colname
    ,fi.field_name_${def:locale}  as  field_name
    ,ff.width
    ,ff.show_order
    ,ff.show_type
FROM
	t_form f
	inner join t_form_excel_field ff
	on ff.form_id = f.tuid
	inner join t_field fi
	on ff.field_id = fi.tuid
WHERE
    f.tuid = ${fld:form_id}

order by 
	show_order