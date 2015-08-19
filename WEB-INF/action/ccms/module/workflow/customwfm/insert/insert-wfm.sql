insert into os_wfm
(
	tuid
	,wfm_name
	,wfm_status
	,remark
	,created
	,createdby
	,table_id
	,xml_value
	,tenantry_id
	,is_template
	,wfm_real_name
	,logo_path
)
values
(
	${fld:tuid}
	,${fld:wfm_name}
	,'1'
	,${fld:remark}
	,{ts '${def:timestamp}'}
	,'${def:user}'
	,${fld:table_id}
	,${fld:xml_value}
	,${fld:tenantry_id}
	,'0'
	,${fld:wfm_real_name}
	,${fld:logo_path}
)