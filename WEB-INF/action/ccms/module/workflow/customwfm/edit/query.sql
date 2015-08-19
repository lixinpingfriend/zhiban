select
	tuid,
	wfm_name,
	wfm_status,
	remark,
	logo_path
from 
	os_wfm
where
	tuid = ${fld:id}