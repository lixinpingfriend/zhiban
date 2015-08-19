SELECT
    lower(fi.field_code)	as	field_code
    ,lower(fi.field_code_alias) as colname
	,concat(lower('${FLD:'),lower(fi.field_code_alias),case when len(ff.format) > 2 then concat('@' , ff.format , '}') when lower(fi.field_type)='varchar' then '@js}' when lower(fi.field_type)='date' then '@yyyy-MM-dd}' when lower(fi.field_type)='timestamp' then '@yyyy-MM-dd HH:mm:ss}' else '}' end) as  colname_mark
    ,fi.field_name_${def:locale}  as  field_name
    ,ff.show_order
FROM
	t_form f
	inner join t_form_grid_field ff
	on ff.form_id = f.tuid
	inner join t_field fi
	on ff.field_id = fi.tuid
WHERE
    f.tuid = ${fld:form_id}
AND
		ff.show_flag = '1'
order by
	ff.show_order