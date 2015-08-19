update
	pm_document 
set
	is_shared = ${fld:is_shared}
where 
	tuid = ${fld:id}
