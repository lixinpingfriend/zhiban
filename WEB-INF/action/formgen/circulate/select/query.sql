SELECT
	h.userlogin
	,h.name
FROM
	hr_staff h
	inner join ${schema}s_user s
	on h.userlogin = s.userlogin and s.enabled = 1
WHERE
	h.org_id = ${fld:org_id}
order by
	h.name