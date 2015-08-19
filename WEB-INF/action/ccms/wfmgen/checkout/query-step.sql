select
	c.entry_id
	,c.step_id
from
	os_currentstep c
where
	id = ${fld:current_id}