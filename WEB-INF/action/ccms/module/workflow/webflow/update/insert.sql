INSERT INTO
os_wfm
(
	tuid
	, tenantry_id
	, table_id
	, wfm_name
	, wfm_status
	, is_template
	,wfm_real_name
	, remark
	, wfm_type
	, xml_value
	,created
	,createdby
)
VALUES
(
	${fld:wfm_id}
	,${def:tenantry}
	,${fld:table_id}
	,${fld:wfm_name}
	,${fld:wfm_status}
	,${fld:is_template}
	,concat('${def:tenantry}_',${fld:wfm_name})
	,${fld:remark}
	,${fld:wfm_type}
	,?
	,{ts '${def:timestamp}'}
	,'${def:user}'
)