INSERT INTO
	t_report_chart
(
	tuid 
	,remark
	,title
	,title_x
	,title_y
	,title_z
	,field_x
	,field_y
	,field_z
	,format_x
	,format_y
	,format_z
	,chart_type
	,is_3d
	,callback_js
	,report_id
	,createdby
	,created
)
VALUES
(
	${seq:nextval@${schema}seq_default}
	,${fld:remark}
	,${fld:title}
	,${fld:title_x}
	,${fld:title_y}
	,${fld:title_z}
	,${fld:field_x}
	,${fld:field_y}
	,${fld:field_z}
	,${fld:format_x}
	,${fld:format_y}
	,${fld:format_z}
	,${fld:chart_type}
	,${fld:is_3d}
	,${fld:callback_js}
	,${fld:report_id}
	,'${def:user}'
	,{ts '${def:timestamp}'}
)
