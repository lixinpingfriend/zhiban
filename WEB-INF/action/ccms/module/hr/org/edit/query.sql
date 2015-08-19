SELECT
	t.org_id
	,t.org_name
	,t.remark
	,t.org_grade
	,t.show_order
	,t.short_name
	,org_type
FROM
	hr_org t
WHERE
	t.org_id = ${fld:id}